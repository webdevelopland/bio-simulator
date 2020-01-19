import { Component } from '@angular/core';

import { Game } from './game';

@Component({
  selector: 'page-planet',
  templateUrl: './planet.component.html',
  styleUrls: ['./planet.component.scss'],
})
export class PlanetComponent {
  game: Game;

  constructor() {
    this.game = new Game();
  }

  start(): void {
    this.game.start();
  }
}
