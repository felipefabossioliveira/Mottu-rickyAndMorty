import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Character } from '../../../core/models/character/character';
import { FavoritesService } from '../../services/favorites';

@Component({
  selector: 'app-character-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './character-detail.html',
  styleUrl: './character-detail.scss'
})
export class CharacterDetailModalComponent implements OnInit {
  @Input() character!: Character;
  @Input() allCharacters: Character[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() toggleFavorite = new EventEmitter<Character>();

  currentIndex = 0;

  constructor(private favService: FavoritesService) { }

  ngOnInit() {
    this.updateCurrentIndex();
  }

  updateCurrentIndex() {
    this.currentIndex = this.allCharacters.findIndex(c => c.id === this.character.id);
  }

  onClose() {
    this.close.emit();
  }

  get isFavorite(): boolean {
    return this.favService.isFavorite(this.character);
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  nextCharacter() {
    if (this.currentIndex < this.allCharacters.length - 1) {
      this.currentIndex++;
      this.character = this.allCharacters[this.currentIndex];
    }
  }

  previousCharacter() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.character = this.allCharacters[this.currentIndex];
    }
  }

  onToggleFavorite() {
    this.toggleFavorite.emit(this.character);
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'alive': return '#55cc44';
      case 'dead': return '#d63d2e';
      default: return '#9e9e9e';
    }
  }

  getStatusLabel(status: string): string {
    switch (status.toLowerCase()) {
      case 'alive': return 'Vivo';
      case 'dead': return 'Morto';
      default: return 'Desconhecido';
    }
  }

  getGenderLabel(gender: string): string {
    switch (gender.toLowerCase()) {
      case 'male': return 'Masculino';
      case 'female': return 'Feminino';
      case 'genderless': return 'Sem gênero';
      default: return 'Desconhecido';
    }
  }
}