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
  intervalC: any;
  minefieldStyle: any;

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

  startChoices() {
    this.intervalC = setInterval(() => {
      this.setEntropicChoice();
    }, 2000);
  }

  pauseChoices() {
    clearInterval(this.intervalC);
  }

  setEntropicChoice() {
    // Remove previous entropic choice
    this.minefield.rows.forEach(row => {
      row.forEach(cell => {
        if (cell.ramdonlyChosen) {
          cell.ramdonlyChosen = false;
        }
      });
    });

    const unpressedCells: Cell[] = [];
    const pressedCellsWithNumbers: Cell[] = [];
    this.minefield.rows.forEach(row => {
      row.forEach(cell => {
        if (!cell.pressed) {
          unpressedCells.push(cell);
        }
        if (cell.pressed && !cell.mined && cell.numberOfSurroundingMines > 0) {
          pressedCellsWithNumbers.push(cell);
        }
      });
    });
    let minesToPlace = this.minefield.mines;

    // Discard obvious matches
    pressedCellsWithNumbers.forEach(cell => {
      const borders: Cell[] = this.getBorders2(cell.row, cell.col);
      if (borders.length <= cell.numberOfSurroundingMines) {
        borders.forEach(c => {
          c.ramdonlyChosen = true;
          minesToPlace--;
        });
      }
    });
  }

  newGame() {
    this.minefield = new Minefield();
    this.defeat = false;
    this.victory = false;
    this.playtime = 0;
    if (this.interval !== undefined) {
      this.pauseTimer();
      this.pauseChoices();
    }

    this.minefieldStyle = {
      'display': 'grid',
      'grid-template-columns': 'repeat(' + this.minefield.rows[0].length.toString() + ', 1fr)',
      'height': (window.innerHeight - 64).toString() + 'px',
      'grid-gap': '1px',
      'background-color': 'rgb(33, 33, 33)'
    };
    this.startTimer();
    this.startChoices();
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
        'display': 'grid',
        'grid-template-columns': 'repeat(' + this.minefield.rows[0].length.toString() + ', 1fr)',
        'height': (window.innerHeight - 64).toString() + 'px',
        'grid-gap': '1px',
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
        'display': 'grid',
        'grid-template-columns': 'repeat(' + this.minefield.rows[0].length.toString() + ', 1fr)',
        'height': (window.innerHeight - 64).toString() + 'px',
        'grid-gap': '1px',
        'background-color': '#7b1fa2'
      };
      this.pauseChoices();
    }
  }

  //  List of empty surrounding cells
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

  // List of NOT empty surrounding cells
  getBorders2(row: number, col: number): Cell[] {
    const borders: Cell[] = [];
    const topRow = (row - 1) >= 0 ? this.minefield.rows[row - 1] : null;
    const midRow = this.minefield.rows[row];
    const bottomRow = (row + 1) < this.minefield.rows.length ? this.minefield.rows[row + 1] : null;
    const up = topRow != null, down = bottomRow != null, left = (col - 1) >= 0, right = (col + 1) < midRow.length;

    if (up && !topRow[col].pressed) {
      borders.push(topRow[col]);
    }

    if (up && left && !topRow[col - 1].pressed) {
      borders.push(topRow[col - 1]);
    }

    if (up && right && !topRow[col + 1].pressed) {
      borders.push(topRow[col + 1]);
    }

    if (down && !bottomRow[col].pressed) {
      borders.push(bottomRow[col]);
    }

    if (down && left && !bottomRow[col - 1].pressed) {
      borders.push(bottomRow[col - 1]);
    }

    if (down && right && !bottomRow[col + 1].pressed) {
      borders.push(bottomRow[col + 1]);
    }

    if (left && !midRow[col - 1].pressed) {
      borders.push(midRow[col - 1]);
    }

    if (right && !midRow[col + 1].pressed) {
      borders.push(midRow[col + 1]);
    }

    return borders;
  }
}
