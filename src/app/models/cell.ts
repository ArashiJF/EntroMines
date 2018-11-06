import { setStyles } from '@angular/animations/browser/src/util';

export class Cell {
    mined: boolean;
    numberOfSurroundingMines: number;
    row: number;
    col: number;
    pressed = false;
    marked = false;
    cssStyle: any = {
        'width': '100%',
        'height': '100%'
    };
    ramdonlyChosen = false;

    constructor() {
        this.mined = false;
        this.numberOfSurroundingMines = 0;
    }

    setNumberOfSurroundingMines(topRow: Cell[] | null, midRow: Cell[], bottomRow: Cell[] | null, row: number, col: number) {

        const up = topRow != null, down = bottomRow != null, left = (col - 1) >= 0, right = (col + 1) < midRow.length;

        this.numberOfSurroundingMines = 0;
        this.numberOfSurroundingMines += up ? (topRow[col].mined ? 1 : 0) : 0;
        this.numberOfSurroundingMines += up && left ? (topRow[col - 1].mined ? 1 : 0) : 0;
        this.numberOfSurroundingMines += up && right ? (topRow[col + 1].mined ? 1 : 0) : 0;

        this.numberOfSurroundingMines += down ? (bottomRow[col].mined ? 1 : 0) : 0;
        this.numberOfSurroundingMines += down && left ? (bottomRow[col - 1].mined ? 1 : 0) : 0;
        this.numberOfSurroundingMines += down && right ? (bottomRow[col + 1].mined ? 1 : 0) : 0;

        this.numberOfSurroundingMines += left ? (midRow[col - 1].mined ? 1 : 0) : 0;
        this.numberOfSurroundingMines += right ? (midRow[col + 1].mined ? 1 : 0) : 0;
    }

    checkIfEmpty() {
        if (this.isEmpty()) {
            this.press();
        }
    }

    isEmpty() {
        return !this.numberOfSurroundingMines && !this.mined;
    }

    checkIfNextToEmptyCell(topRow: Cell[] | null, midRow: Cell[], bottomRow: Cell[] | null) {
        if (this.pressed || this.mined) {
            return;
        }

        const up = topRow != null, down = bottomRow != null, left = (this.col - 1) >= 0, right = (this.col + 1) < midRow.length;

        const pressed = (up && topRow[this.col].isEmpty() && topRow[this.col].pressed) ||
                       (down && bottomRow[this.col].isEmpty() && bottomRow[this.col].pressed) ||
                       (left && midRow[this.col - 1].isEmpty() && midRow[this.col - 1].pressed) ||
                       (right && midRow[this.col + 1].isEmpty() && midRow[this.col + 1].pressed);

        if (pressed) {
            this.press();
        }
    }

    press() {
        this.pressed = true;
        if (this.mined) {
            this.cssStyle = {
                'width': '100%',
                'height': '100%',
                'background-color': '#f44336'
            };
        } else {
            if (this.marked) {
                this.cssStyle = {
                  'width': '100%',
                  'height': '100%',
                  'background-color': '#69f0ae'
                };
            } else {
                this.cssStyle = {
                    'width': '100%',
                    'height': '100%',
                    'background-color': '#888'
                };
            }
        }
    }
}
