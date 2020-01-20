import { rand } from 'rndmjs';
import { interval, Subscription } from 'rxjs';

import { PLANET_SIZE } from './const';

export class Game {
  matrix: Matrix;
  cells: Cell[] = [];
  intervalSub = new Subscription();
  isPlaying: boolean = false;
  round: number = 0;

  constructor() {
    this.init();
  }

  init(): void {
    this.initMatrix();
    this.createCells();
  }

  createCells(): void {
    const coords: number[][] = [];
    for (let i = 0; i < PLANET_SIZE; i++) {
      for (let j = 0; j < PLANET_SIZE; j++) {
        const cell: MatrixCell = this.getCell(j, i);
        coords.push([cell.x, cell.y]);
      }
    }
    shuffle(coords);
    for (let i = 0; i < 2; i++) {
      const cat = new Cell(this);
      cat.color = '#19BF2C';
      cat.x = coords[i][0];
      cat.y = coords[i][1];
      this.cells.push(cat);
      cat.place();
    }
  }

  start(): void {
    this.intervalSub = interval(5).subscribe(() => {
      shuffle(this.cells);
      for (const cell of this.cells) {
        if (!cell.isDead) {
          cell.action(this.round);
        }
      }
      this.round++;
    });
    this.isPlaying = true;
  }

  pause(): void {
    this.isPlaying = false;
    this.intervalSub.unsubscribe();
  }

  initMatrix(): void {
    const matrix: Matrix = { rowList: [] };
    for (let i = 0; i < PLANET_SIZE; i++) {
      const row: Row = { cellList: [] };
      for (let j = 0; j < PLANET_SIZE; j++) {
        const empty = new GroundCell(this);
        empty.color = 'white';
        empty.x = j;
        empty.y = i;
        row.cellList.push(empty);
      }
      matrix.rowList.push(row);
    }
    this.matrix = matrix;

    const ground = this.matrix
      .rowList[Math.floor(PLANET_SIZE/2)]
      .cellList[Math.floor(PLANET_SIZE/2)] as GroundCell;
    ground.setLight(100);
  }

  getCell(x: number, y: number): MatrixCell {
    x = repeatDirection(x);
    y = repeatDirection(y);
    return this.matrix.rowList[y].cellList[x];
  }
}

export interface Row {
  cellList: MatrixCell[];
}
export interface Matrix {
  rowList: Row[];
}

export class MatrixCell {
  game: Game;
  color: string;
  x: number;
  y: number;

  constructor(game: Game) {
    this.game = game;
  }
}

export class GroundCell extends MatrixCell {
  light: number = 0;

  setLight(light: number): void {
    this.light = light;
    this.color = '#ffd800';
  }
}

export class Cell extends MatrixCell {
  isDead: boolean = false;
  energy: number = 100;
  speed: number = 300;

  action(round: number): void {
    if (round % Math.floor(10000 / this.speed) === 0) {
      this.move();
      this.check();
    }
  }

  move(): void {
    const options = [
      [0, 1], [1, 0], [0, -1], [-1, 0],
    ];
    const cellsToGo: MatrixCell[] = [];
    for (const option of options) {
      const cell: MatrixCell = this.game.getCell(this.x + option[0], this.y + option[1]);
      if (cell instanceof GroundCell) {
        cellsToGo.push(cell);
      }
    }
    if (cellsToGo.length > 0 && this.energy > 0) {
      // Swap empty cell and the cell
      const cellToGo: MatrixCell = cellsToGo[rand(0, cellsToGo.length - 1)];
      this.game.matrix.rowList[this.y].cellList[this.x] = cellToGo;
      const currentX = this.x;
      const currentY = this.y;
      this.x = cellToGo.x;
      this.y = cellToGo.y;
      cellToGo.x = currentX;
      cellToGo.y = currentY;
      this.place();
      this.energy -= 1;
    }
  }

  check(): void {
    if (this.energy <= 0) {
      this.isDead = true;
      this.color = 'grey';
    }
  }

  place(): void {
    this.game.matrix.rowList[this.y].cellList[this.x] = this;
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
