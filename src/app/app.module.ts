import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { CellComponent } from './cell/cell.component';
import { MatGridListModule, MatButtonModule, MatToolbarModule, MatCardModule } from '@angular/material';
import { TimePipe } from './time.pipe';

@NgModule({
  declarations: [
    AppComponent,
    CellComponent,
    TimePipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatButtonModule,
    MatToolbarModule,
    MatCardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
