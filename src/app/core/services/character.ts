import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CharacterApiResponse } from '../models/character/character-api-response.model';

@Injectable({ providedIn: 'root' })
export class CharacterService {

  private apiUrl = 'https://rickandmortyapi.com/api/character';

  constructor(private http: HttpClient) { }

  searchCharacters(name: string = '', page: number = 1): Observable<CharacterApiResponse> {
    let params = new HttpParams().set('page', page.toString());

    const normalizedName = (name ?? '').toString().trim();

    if (normalizedName) {
      params = params.set('name', normalizedName);
    }

    return this.http.get<CharacterApiResponse>(this.apiUrl, { params });
  }
}
