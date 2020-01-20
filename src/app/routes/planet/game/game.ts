import { rand } from 'rndmjs';
import { interval, Subscription } from 'rxjs';

import { Point, Color } from '@/core/types';
import { PLANET_SIZE } from './const';

export class Game {
  colorMatrix: Color[][];
  cellMatrix: Cell[][];
  groundMatrix: Ground[][];
  cells: Cell[] = [];
  intervalSub = new Subscription();
  isPlaying: boolean = false;
  round: number = 0;

  constructor() {
    this.init();
  }

  init(): void {
    this.initMatrix();
    this.initLight();
    this.createCells();
    this.updateColorMatrix();
  }

  createCells(): void {
    const coords: number[][] = [];
    this.cellMatrix = [];
    for (let i = 0; i < PLANET_SIZE; i++) {
      this.cellMatrix[i] = [];
      for (let j = 0; j < PLANET_SIZE; j++) {
        this.cellMatrix[i][j] = undefined;
        coords.push([j, i]);
      }
    }
    shuffle(coords);
    for (let i = 0; i < 3; i++) {
      const cat = new Cell(this);
      cat.color = '#19bf2c';
      cat.x = coords[i][0];
      cat.y = coords[i][1];
      this.cells.push(cat);
      cat.place();
    }
  }

  updateColorMatrix(): void {
    this.colorMatrix = [];
    for (let i = 0; i < PLANET_SIZE; i++) {
      this.colorMatrix[i] = [];
      for (let j = 0; j < PLANET_SIZE; j++) {
        if (this.cellMatrix[i][j]) {
          this.colorMatrix[i][j] = {
            hex: this.cellMatrix[i][j].color,
            opacity: 0,
          };
        } else {
          if (this.groundMatrix[i][j].light > 0) {
            this.colorMatrix[i][j] = this.colorMatrix[i][j] = {
              hex: 'white',
              opacity: this.groundMatrix[i][j].light * 0.5,
            };
          } else {
            this.colorMatrix[i][j] = {
              hex: 'white',
              opacity: 0,
            };
          }
        }
      }
    }
  }

  start(): void {
    this.intervalSub = interval(10).subscribe(() => {
      shuffle(this.cells);
      for (const cell of this.cells) {
        if (!cell.isDead) {
          cell.action(this.round);
        }
      }
      this.updateColorMatrix();
      this.round++;
    });
    this.isPlaying = true;
  }

  pause(): void {
    this.isPlaying = false;
    this.intervalSub.unsubscribe();
  }

  initMatrix(): void {
    const matrix: Ground[][] = [];
    for (let i = 0; i < PLANET_SIZE; i++) {
      const row: Ground[] = [];
      for (let j = 0; j < PLANET_SIZE; j++) {
        const empty = new Ground(this);
        empty.color = 'white';
        empty.x = j;
        empty.y = i;
        row.push(empty);
      }
      matrix.push(row);
    }
    this.groundMatrix = matrix;
  }

  initLight(): void {
    const center: number = Math.floor(PLANET_SIZE / 2);
    const fading: number = 0.2;
    const levelsAmount: number = Math.round(1 / fading);
    for (let level = 0; level < levelsAmount; level++) {
      for (let i = -level; i <= level; i++) {
        for (let j = -level; j <= level; j++) {
          const ground: Ground = this.getCell(center + i, center + j);
          ground.light += fading;
        }
      }
    }
  }

  getCell(x: number, y: number): Ground {
    x = repeatDirection(x);
    y = repeatDirection(y);
    return this.groundMatrix[y][x];
  }
}

export class Box {
  game: Game;
  color: string;
  x: number;
  y: number;

  constructor(game: Game) {
    this.game = game;
  }
}

export class Ground extends Box {
  light: number = 0;
}

export class Cell extends Box {
  isDead: boolean = false;
  energy: number = 100;
  // speed: number = 200;

  action(round: number): void {
    this.move();
    this.photosynthesis();
    // if (round % (1000 / this.speed) === 0) {
    //   this.move();
    // }
    // if (round % (1000 / 20) === 0) {
    //   this.photosynthesis();
    // }
    this.check();
  }

  move(): void {
    const options: number[][] = [
      [0, 1], [1, 0], [0, -1], [-1, 0],
    ];
    const pointsToGo: Point[] = [];
    for (const option of options) {
      const ground: Ground = this.game.getCell(this.x + option[0], this.y + option[1]);
      if (this.game.cellMatrix[ground.x, ground.y]) {
        pointsToGo.push({ x: ground.x, y: ground.y });
      }
    }
    if (pointsToGo.length > 0 && this.energy > 0) {
      // Swap empty cell and the cell
      const pointToGo: Point = pointsToGo[rand(0, pointsToGo.length - 1)];
      this.game.cellMatrix[this.y][this.x] = undefined;
      this.x = pointToGo.x;
      this.y = pointToGo.y;
      this.place();
      this.energy -= 1;
    }
  }

  photosynthesis(): void {
    const ground: Ground = this.game.getCell(this.x, this.y);
    this.energy += ground.light * 20;
    if (this.energy > 100) {
      this.energy = 100;
    }
  }

  check(): void {
    if (this.energy <= 0) {
      this.isDead = true;
      this.color = 'grey';
    }
  }

  place(): void {
    this.game.cellMatrix[this.y][this.x] = this;
  }
}

function repeatDirection(position: number) {
  if (position > PLANET_SIZE - 1) {
    position -= PLANET_SIZE;
  }
  if (position < 0) {
    position += PLANET_SIZE;
  }
  return position;
}

function shuffle(a: any[]): any[] {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
