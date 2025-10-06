import { Component, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, catchError, takeUntil } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import { CharacterService } from '../../../core/services/character';
import { Character } from '../../../core/models/character/character';

@Component({
  selector: 'app-search-autocomplete',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search-autocomplete.html',
  styleUrl: './search-autocomplete.scss'
})
export class SearchAutocompleteComponent implements OnDestroy {
  @Input() placeholder = 'Pesquisar personagem';
  @Output() searchChange = new EventEmitter<string>();
  @Output() suggestionSelected = new EventEmitter<Character>();

  searchControl = new FormControl('');
  suggestions: Character[] = [];
  isLoading = false;
  showSuggestions = false;

  private destroy$ = new Subject<void>();

  constructor(private characterService: CharacterService) {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => {
        const searchTerm = value?.trim() || '';

        this.searchChange.emit(searchTerm);

        if (searchTerm.length < 2) {
          this.suggestions = [];
          this.showSuggestions = false;
          return of([]);
        }

        this.isLoading = true;
        this.showSuggestions = true;

        return this.characterService.getSuggestions(searchTerm).pipe(
          catchError(() => {
            this.isLoading = false;
            return of([]);
          })
        );
      }),
      takeUntil(this.destroy$)
    ).subscribe(suggestions => {
      this.suggestions = suggestions;
      this.isLoading = false;
    });
  }

  selectSuggestion(character: Character) {
    this.searchControl.setValue(character.name, { emitEvent: false });
    this.showSuggestions = false;
    this.suggestionSelected.emit(character);
  }

  onInputFocus() {
    if (this.suggestions.length > 0) {
      this.showSuggestions = true;
    }
  }

  onInputBlur() {
    // Delay para permitir click nas sugestões
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }

  clearSearch() {
    this.searchControl.setValue('');
    this.suggestions = [];
    this.showSuggestions = false;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}