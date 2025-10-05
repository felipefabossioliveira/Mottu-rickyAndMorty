import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { CharacterCardComponent } from '../character-card/character-card';
import { PaginationComponent } from '../pagination/pagination';
import { Character } from '../../models/character/character';
import { FavoritesService } from '../../services/favorites';
import { CharacterDetailModalComponent } from '../character-detail/character-detail';


@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterModule, CharacterCardComponent, PaginationComponent, CharacterDetailModalComponent],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss',
})
export class FavoritesComponent implements OnInit {
  favorites$!: Observable<Character[]>;
  selectedCharacter: Character | null = null;
  displayedFavorites: Character[] = [];
  allFavorites: Character[] = [];

  currentPage = 1;
  itemsPerPage = 9;
  totalPages = 0;

  constructor(private favService: FavoritesService) { }

  ngOnInit(): void {
    this.favorites$ = this.favService.favorites$;

    this.favorites$.subscribe((favs) => {
      this.allFavorites = favs;
      this.currentPage = 1;
      this.updateDisplayedFavorites();
    });
  }

  updateDisplayedFavorites() {
    this.totalPages = Math.ceil(this.allFavorites.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedFavorites = this.allFavorites.slice(startIndex, endIndex);
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

  onPageChange(page: number) {
    this.currentPage = page;
    this.updateDisplayedFavorites();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  remove(id: number) {
    this.favService.removeFavorite(id);
  }
}
