import { Cell } from './cell';

export class Minefield {
    rows: Cell[][];
    mines: number;
    size: number;

    constructor(rows: number = 8, columns: number = 8, mines: number = 10) {
        this.rows = [];
        this.mines = mines;
        this.size = rows * columns;
        for (let row = 0; row < rows; row++) {
            const aux: Cell[] = [];
            for (let column = 0; column < columns; column++) {
                aux.push(new Cell());
            }
            this.rows.push(aux);
        }

        // Setting the mines
        while (mines) {
            const row = Math.trunc(Math.random() * this.rows.length);
            const column = Math.trunc(Math.random() * this.rows[0].length);
            if (!this.rows[row][column].mined) {
                this.rows[row][column].mined = true;
                mines--;
            }
        }

        // Set number of surrounding mines
        this.rows.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
                cell.row = rowIndex;
                cell.col = columnIndex;
                cell.setNumberOfSurroundingMines(
                    (rowIndex - 1) >= 0 ? this.rows[rowIndex - 1] : null,
                    row,
                    (rowIndex + 1) < this.rows.length ? this.rows[rowIndex + 1] : null,
                    rowIndex,
                    columnIndex
                );
            });
        });
    }
}
