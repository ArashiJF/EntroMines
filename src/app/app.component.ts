import { Component } from '@angular/core';
import { Minefield } from './models/minefield';
import { Cell } from './models/cell';
import { TimeInterval } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  minefield: Minefield;
  defeat: boolean;
  victory: boolean;
  playtime = 0;
  interval: any;
  minefieldStyle: any = {};
  entropicChoices: Cell[][];

  constructor() {
    this.newGame();
  }

  startTimer() {
    this.interval = setInterval(() => {
      this.playtime++;
    }, 1000);
  }

  pauseTimer() {
    clearInterval(this.interval);
  }

  newGame() {
    this.minefield = new Minefield();
    this.defeat = false;
    this.victory = false;
    this.playtime = 0;
    if (this.interval !== undefined) {
      this.pauseTimer();
    }
    this.startTimer();
  }

  cellChecked(result) {
    if (this.defeat || this.victory) {
      return;
    }

    if (result[0]) {
      this.pauseTimer();
      this.defeat = true;
      this.minefield.rows.forEach(row => {
        row.forEach(cell => {
          cell.press();
        });
      });
      this.minefieldStyle = {
        'background-color': 'rgb(33, 33, 33)'
      };
    } else {
      if (!result[1]) {
        let borders: Cell[] = this.getBorders(result[2], result[3]);
        while (borders.length) {
          let newBorders: Cell[] = [];
          borders.forEach(cell => {
            cell.checkIfEmpty();
            newBorders = newBorders.concat(this.getBorders(cell.row, cell.col));
          });

          borders = [];
          newBorders.forEach(border => {
            if (!border.pressed) {
              borders.push(border);
            }
          });
        }

        this.minefield.rows.forEach(row => {
          row.forEach(cell => {
            const topRow = (cell.row - 1) >= 0 ? this.minefield.rows[cell.row - 1] : null;
            const midRow = this.minefield.rows[cell.row];
            const bottomRow = (cell.row + 1) < this.minefield.rows.length ? this.minefield.rows[cell.row + 1] : null;
            cell.checkIfNextToEmptyCell(topRow, midRow, bottomRow);
          });
        });
      }
    }

    let pressedCells = 0;
    this.minefield.rows.forEach(row => {
      row.forEach(cell => {
        if (cell.pressed && !cell.mined) {
          pressedCells += 1;
        }
      });
    });

    if (pressedCells === (this.minefield.size - this.minefield.mines)  && !this.defeat) {
      this.pauseTimer();
      this.victory = true;
      this.minefieldStyle = {
        'background-color': '#7b1fa2'
      };
    }
  }

  getBorders(row: number, col: number): Cell[] {
    const borders: Cell[] = [];
    const topRow = (row - 1) >= 0 ? this.minefield.rows[row - 1] : null;
    const midRow = this.minefield.rows[row];
    const bottomRow = (row + 1) < this.minefield.rows.length ? this.minefield.rows[row + 1] : null;
    const up = topRow != null, down = bottomRow != null, left = (col - 1) >= 0, right = (col + 1) < midRow.length;

    if (up && topRow[col].isEmpty()) {
      borders.push(topRow[col]);
    }

    if (down && bottomRow[col].isEmpty()) {
      borders.push(bottomRow[col]);
    }

    if (left && midRow[col - 1].isEmpty()) {
      borders.push(midRow[col - 1]);
    }

    if (right && midRow[col + 1].isEmpty()) {
      borders.push(midRow[col + 1]);
    }

    return borders;
  }
}
