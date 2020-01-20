import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
declare var Snap: any;

import { Game, PLANET_SIZE } from './game';

@Component({
  selector: 'page-planet',
  templateUrl: './planet.component.html',
  styleUrls: ['./planet.component.scss'],
})
export class PlanetComponent implements AfterViewInit {
  game: Game;
  snap: any;
  @ViewChild('svg', { static: false }) svg: ElementRef;

  constructor() {
    this.game = new Game();
  }

  ngAfterViewInit() {
    this.snap = new Snap(this.svg.nativeElement);
    this.game.matrixChanges.subscribe(() => {
      this.updateMatrix();
    });
  }

  updateMatrix(): void {
    this.snap.clear();
    for (let i = 0; i < PLANET_SIZE; i++) {
      for (let j = 0; j < PLANET_SIZE; j++) {
        const box = this.snap.rect(10*j, 10*i, 10, 10);
        if (this.game.cellMatrix[i][j]) {
          box.attr({ fill: this.game.cellMatrix[i][j].color });
        } else {
          if (this.game.groundMatrix[i][j].light > 0) {
            box.attr({ fill: 'yellow', "fill-opacity": this.game.groundMatrix[i][j].light * 0.5 });
          } else {
            box.attr({ fill: 'white' });
          }
        }
      }
    }
  }

  start(): void {
    this.game.start();
  }

  pause(): void {
    this.game.pause();
  }
}
