import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { FavoritesService } from '../../services/favorites';
import { Character } from '../../models/character/character';
import { CommonModule } from '@angular/common';
import { CharacterCardComponent } from '../character-card/character-card';
import { PaginationComponent } from '../pagination/pagination';
import { CharacterDetailModalComponent } from '../character-detail/character-detail';
import { SearchAutocompleteComponent } from '../search-autocomplete/search-autocomplete';
import { SearchStateService } from '../../services/search-state';
import { CharacterService } from '../../services/character';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    CharacterCardComponent,
    PaginationComponent,
    CharacterDetailModalComponent,
    SearchAutocompleteComponent
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent implements OnInit, OnDestroy {


  selectedCharacter: Character | null = null;
  characters: Character[] = [];
  isLoading = false;
  errorMessage = '';

  currentPage = 1;
  itemsPerPage = 9;
  totalPages = 0;

  private destroy$ = new Subject<void>();

  constructor(
    private searchStateService: SearchStateService,
    private favService: FavoritesService,
    private characterService: CharacterService
  ) { }

  ngOnInit(): void {
    this.searchStateService.results$
      .pipe(takeUntil(this.destroy$))
      .subscribe(results => {
        this.characters = results;
        this.currentPage = 1;
        this.updatePagination();
      });

    this.searchStateService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.isLoading = loading;
      });

    this.searchStateService.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        this.errorMessage = error;
      });

    this.searchStateService.setSearchTerm('');

    this.refreshCharacters();
  }

  refreshCharacters() {
    if (this.characters.length === 0) {
      this.characterService.searchCharacters('').subscribe(characters => {
        this.characters = characters.results;
        this.updatePagination();
      })
    }
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

  updatePagination() {
    this.totalPages = Math.ceil(this.characters.length / this.itemsPerPage);
  }

  get displayedCharacters(): Character[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.characters.slice(startIndex, endIndex);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  isFavorite(char: Character): boolean {
    return this.favService.isFavorite(char);
  }

  onToggleFavorite(char: Character) {
    if (this.favService.isFavorite(char)) {
      this.favService.removeFavorite(char.id);
    } else {
      this.favService.addFavorite(char);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}