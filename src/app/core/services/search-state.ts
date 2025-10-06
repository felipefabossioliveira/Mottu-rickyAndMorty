import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError, tap } from 'rxjs/operators';
import { CharacterService } from './character';
import { Character } from '../models/character/character';
import { CharacterApiResponse } from '../models/character/character-api-response.model';

@Injectable({
    providedIn: 'root'
})
export class SearchStateService {
    private searchTermSubject = new BehaviorSubject<string>('');
    private resultsSubject = new BehaviorSubject<Character[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private errorSubject = new BehaviorSubject<string>('');
    private suggestionsSubject = new BehaviorSubject<Character[]>([]);

    searchTerm$ = this.searchTermSubject.asObservable();
    results$ = this.resultsSubject.asObservable();
    loading$ = this.loadingSubject.asObservable();
    error$ = this.errorSubject.asObservable();
    suggestions$ = this.suggestionsSubject.asObservable();

    constructor(private characterService: CharacterService) {
        this.setupSearchObservable();
    }

    private setupSearchObservable() {
        this.searchTerm$.pipe(
            debounceTime(400),
            distinctUntilChanged(),
            tap(() => {
                this.loadingSubject.next(true);
                this.errorSubject.next('');
            }),
            switchMap(term =>
                this.characterService.searchCharacters({ name: term, page: 1 }).pipe(
                    catchError(() => {
                        this.errorSubject.next('Nenhum personagem encontrado.');
                        this.loadingSubject.next(false);
                        return [{
                            info: { count: 0, pages: 0, next: null, prev: null },
                            results: []
                        } as CharacterApiResponse];
                    })
                )
            )
        ).subscribe(response => {
            this.resultsSubject.next(response.results || []);
            this.loadingSubject.next(false);

            if (response.results.length === 0) {
                this.errorSubject.next('Nenhum personagem encontrado.');
            }
        });
    }

    setSearchTerm(term: string) {
        this.searchTermSubject.next(term);
    }

    setSuggestions(suggestions: Character[]) {
        this.suggestionsSubject.next(suggestions);
    }

    clearSearch() {
        this.searchTermSubject.next('');
        this.resultsSubject.next([]);
        this.errorSubject.next('');
        this.suggestionsSubject.next([]);
    }

    getCurrentSearchTerm(): string {
        return this.searchTermSubject.value;
    }

    getCurrentResults(): Character[] {
        return this.resultsSubject.value;
    }

    isLoading(): boolean {
        return this.loadingSubject.value;
    }

    getError(): string {
        return this.errorSubject.value;
    }
}