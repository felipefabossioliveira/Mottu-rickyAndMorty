import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Character } from '../../../core/models/character/character';

@Component({
  selector: 'app-character-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './character-card.html',
  styleUrl: './character-card.scss'
})
export class CharacterCardComponent {
  @Input() character!: Character;
  @Input() isFavorite = false;
  @Output() toggleFavorite = new EventEmitter<Character>();
  @Output() cardClick = new EventEmitter<Character>();


  onToggleFavorite() {
    this.toggleFavorite.emit(this.character);
  }

  onCardClick() {
    this.cardClick.emit(this.character);
  }
}