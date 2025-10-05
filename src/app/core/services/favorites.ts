import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Character } from '../models/character/character';

@Injectable({ providedIn: 'root' })
export class FavoritesService {

  private favoritesSubject = new BehaviorSubject<Character[]>(this.loadFavorites());
  favorites$ = this.favoritesSubject.asObservable();

  private loadFavorites(): Character[] {
    return JSON.parse(localStorage.getItem('favorites') || '[]');
  }

  private saveFavorites(favs: Character[]) {
    localStorage.setItem('favorites', JSON.stringify(favs));
    this.favoritesSubject.next(favs);
  }

  addFavorite(character: Character) {
    const currentFavs = this.favoritesSubject.value;
    if (!currentFavs.some(f => f.id === character.id)) {
      const favs = [...currentFavs, character];
      this.saveFavorites(favs);
    }
  }

  isFavorite(character: Character): boolean {
    const currentFavs = this.favoritesSubject.value; 
    return currentFavs.some(f => f.id === character.id);
  }

  removeFavorite(id: number) {
    const currentFavs = this.favoritesSubject.value; 
    const favs = currentFavs.filter(c => c.id !== id);
    this.saveFavorites(favs);
  }

  getFavoritesCount(): number {
    return this.favoritesSubject.value.length;
  }
}