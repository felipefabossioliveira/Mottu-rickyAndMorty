import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, Subject, takeUntil, combineLatest, map } from 'rxjs';
import { CharacterCardComponent } from '../character-card/character-card';
import { PaginationComponent } from '../pagination/pagination';
import { SearchAutocompleteComponent } from '../search-autocomplete/search-autocomplete';
import { Character } from '../../models/character/character';
import { SearchStateService } from '../../services/search-state';
import { FavoritesService } from '../../services/favorites';
import { CharacterDetailModalComponent } from '../character-detail/character-detail';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterModule, CharacterCardComponent, PaginationComponent, SearchAutocompleteComponent, CharacterDetailModalComponent],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss'
})
export class FavoritesComponent implements OnInit, OnDestroy {
  selectedCharacter: Character | null = null;
  favorites$!: Observable<Character[]>;
  displayedFavorites: Character[] = [];
  allFavorites: Character[] = [];
  filteredFavorites: Character[] = [];

  currentPage = 1;
  itemsPerPage = 9;
  totalPages = 0;
  searchTerm = '';

  private destroy$ = new Subject<void>();

  constructor(
    private favService: FavoritesService,
    private searchStateService: SearchStateService
  ) { }

  ngOnInit(): void {
    this.favorites$ = this.favService.favorites$;

    combineLatest([
      this.favorites$,
      this.searchStateService.searchTerm$
    ]).pipe(
      takeUntil(this.destroy$),
      map(([favorites, searchTerm]) => {
        this.allFavorites = favorites;
        this.searchTerm = searchTerm.toLowerCase();

        if (!this.searchTerm) {
          return favorites;
        }

        return favorites.filter(fav =>
          fav.name.toLowerCase().includes(this.searchTerm) ||
          fav.species.toLowerCase().includes(this.searchTerm) ||
          fav.status.toLowerCase().includes(this.searchTerm)
        );
      })
    ).subscribe(filtered => {
      this.filteredFavorites = filtered;
      this.currentPage = 1;
      this.updateDisplayedFavorites();
    });
  }

  updateDisplayedFavorites() {
    this.totalPages = Math.ceil(this.filteredFavorites.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedFavorites = this.filteredFavorites.slice(startIndex, endIndex);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updateDisplayedFavorites();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onSearchChange(searchTerm: string) {
    this.searchStateService.setSearchTerm(searchTerm);
  }

  onSuggestionSelected(character: Character) {
    this.openModal(character);
  }

  openModal(character: Character) {
    this.selectedCharacter = character;
  }

  onToggleFavorite(char: Character) {
    if (this.favService.isFavorite(char)) {
      this.favService.removeFavorite(char.id);
    } else {
      this.favService.addFavorite(char);
    }
  }

  remove(id: number) {
    this.favService.removeFavorite(id);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.searchStateService.clearSearch();
  }
}