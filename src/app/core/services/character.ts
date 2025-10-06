import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CharacterApiResponse } from '../models/character/character-api-response.model';
import { Character } from '../models/character/character';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  private apiUrl = 'https://rickandmortyapi.com/api/character';

  constructor(private http: HttpClient) { }

  searchCharacters(filters: any): Observable<CharacterApiResponse> {
    let params = new HttpParams();

    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params = params.set(key, filters[key]);
      }
    });

    return this.http.get<CharacterApiResponse>(this.apiUrl, { params });
  }

  getSuggestions(name: string): Observable<Character[]> {
    if (!name || name.trim().length < 2) {
      return new Observable(observer => observer.next([]));
    }

    let params = new HttpParams().set('name', name.trim());

    return this.http.get<CharacterApiResponse>(this.apiUrl, { params }).pipe(
      map(response => response.results.slice(0, 5))
    );
  }
}