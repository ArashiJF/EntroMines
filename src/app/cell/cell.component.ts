import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Cell } from '../models/cell';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.css']
})
export class CellComponent implements OnInit {
  @Input() cell: Cell;
  @Input() victory: boolean;
  @Input() defeat: boolean;
  @Output() afterChecked: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() { }

  check() {
    if (this.cell.marked || this.cell.pressed || this.victory || this.defeat) {
      return;
    }
    this.cell.press();
    this.afterChecked.next([this.cell.mined, this.cell.numberOfSurroundingMines, this.cell.row, this.cell.col]);
  }

  mark() {
    this.cell.marked = !this.cell.marked;
    return false;
  }
}
