import { rand } from 'rndmjs';

import { PLANET_SIZE } from './const';

export class Game {
  matrix: Matrix;
  cells: Cell[] = [];

  constructor() {
    this.init();
  }

  init(): void {
    this.draw();
    this.createCells();
    this.draw();
  }

  createCells(): void {
    const coords: number[][] = [];
    for (let i = 0; i < PLANET_SIZE; i++) {
      for (let j = 0; j < PLANET_SIZE; j++) {
        const cell: Cell = this.getCell(j, i);
        coords.push([cell.x, cell.y]);
      }
    }
    shuffle(coords);
    for (let i = 0; i < 25; i++) {
      const cat = new Cell(this);
      cat.color = '#ffb400';
      cat.x = coords[i][0];
      cat.y = coords[i][1];
      cat.isAnimal = true;
      this.cells.push(cat);
    }
  }

  start(): void {
    setInterval(() => {
      for (const cell of this.cells) {
        if (cell.isAnimal) {
          cell.move();
        }
      }
      this.draw();
    }, 100);
  }

  draw(): void {
    const matrix: Matrix = { rowList: [] };
    for (let i = 0; i < PLANET_SIZE; i++) {
      const row: Row = { cellList: [] };
      for (let j = 0; j < PLANET_SIZE; j++) {
        const empty = new Cell(this);
        empty.isEmpty = true;
        empty.color = 'white';
        empty.x = j;
        empty.y = i;
        row.cellList.push(empty);
      }
      matrix.rowList.push(row);
    }
    this.matrix = matrix;

    for (const cell of this.cells) {
      cell.place();
    }
  }

  getCell(x: number, y: number): Cell {
    x = repeatDirection(x);
    y = repeatDirection(y);
    return this.matrix.rowList[y].cellList[x];
  }
}

export interface Row {
  cellList: Cell[];
}
export interface Matrix {
  rowList: Row[];
}

export class Cell {
  game: Game;
  color: string;
  x: number;
  y: number;
  isEmpty: boolean = false;
  isAnimal: boolean = false;

  constructor(game: Game) {
    this.game = game;
  }

  move(): void {
    const options = [
      [0, 1], [1, 0], [0, -1], [-1, 0],
    ];
    const cellsToGo: Cell[] = [];
    for (const option of options) {
      const cell: Cell = this.game.getCell(this.x + option[0], this.y + option[1]);
      if (cell.isEmpty) {
        cellsToGo.push(cell);
      }
    }
    const cellToGo: Cell = cellsToGo[rand(0, cellsToGo.length - 1)];
    this.game.matrix.rowList[this.y].cellList[this.x] = cellToGo;
    const currentX = this.x;
    const currentY = this.y;
    this.x = cellToGo.x;
    this.y = cellToGo.y;
    cellToGo.x = currentX;
    cellToGo.y = currentY;
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
