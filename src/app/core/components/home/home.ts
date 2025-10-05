import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  startWith,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { CharacterService } from '../../services/character';
import { FavoritesService } from '../../services/favorites';
import { Character } from '../../models/character/character';
import { CommonModule } from '@angular/common';
import { CharacterApiResponse } from '../../models/character/character-api-response.model';
import { CharacterCardComponent } from '../character-card/character-card';
import { PaginationComponent } from '../pagination/pagination';
import { CharacterDetailModalComponent } from '../character-detail/character-detail';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CharacterCardComponent, PaginationComponent, CharacterDetailModalComponent, CharacterDetailModalComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  searchControl = new FormControl('');
  selectedCharacter: Character | null = null;
  characters: Character[] = [];
  isLoading = true;
  errorMessage = '';

  // Paginação LOCAL (9 por página)
  currentPage = 1;
  itemsPerPage = 9;
  totalPages = 0;
  currentSearchTerm = '';

  private destroy$ = new Subject<void>();

  constructor(private charService: CharacterService, private favService: FavoritesService) { }

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(400),
        distinctUntilChanged(),
        map((value) => value ?? ''),
        tap((searchTerm) => {
          this.isLoading = true;
          this.errorMessage = '';
          this.currentPage = 1;
          this.currentSearchTerm = searchTerm;
        }),
        switchMap((name: string) =>
          this.charService.searchCharacters(name, 1).pipe(
            catchError((err) => {
              this.errorMessage = 'Nenhum personagem encontrado.';
              return of({
                info: { count: 0, pages: 0, next: null, prev: null },
                results: [],
              } as CharacterApiResponse);
            })
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((resp: CharacterApiResponse) => {
        this.isLoading = false;
        this.characters = resp.results || [];
        this.updatePagination();

        if (this.characters.length === 0 && !this.errorMessage) {
          this.errorMessage = 'Nenhum personagem encontrado.';
        }
      });
  }

  openModal(character: Character) {
    console.log('Opening modal for character:', character);
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
