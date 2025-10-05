import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { map, Observable } from 'rxjs';
import { FavoritesService } from '../../core/services/favorites';
import { Character } from '../../core/models/character/character';
import { CharacterCardComponent } from '../../core/components/character-card/character-card';
import { PaginationComponent } from '../../core/components/pagination/pagination';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterModule, CharacterCardComponent, PaginationComponent],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss',
})
export class FavoritesComponent implements OnInit {
  favorites$!: Observable<Character[]>;
  displayedFavorites: Character[] = [];
  allFavorites: Character[] = [];

  currentPage = 1;
  itemsPerPage = 9;
  totalPages = 0;

  constructor(private favService: FavoritesService) {}

  ngOnInit(): void {
    this.favorites$ = this.favService.favorites$;

    // Sempre que os favoritos mudarem, atualiza a paginação
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

  onPageChange(page: number) {
    this.currentPage = page;
    this.updateDisplayedFavorites();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  remove(id: number) {
    this.favService.removeFavorite(id);
  }
}
