import { Component } from '@angular/core';
import { FavoritesService } from '../../services/favorites';
import { map } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CounterAnimationDirective } from '../../shared/directives/counter-animation';

@Component({
  selector: 'app-header',
  imports: [AsyncPipe, RouterLinkActive, RouterLink, CounterAnimationDirective],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent {
  favoritesCount$;

  constructor(private favoritesService: FavoritesService) {
    this.favoritesCount$ = this.favoritesService.favorites$.pipe(map((favs) => favs.length));
  }
}
