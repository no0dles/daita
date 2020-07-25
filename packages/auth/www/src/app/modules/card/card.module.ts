import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './components/card/card.component';
import { CardListComponent } from './components/card-list/card-list.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [CardComponent, CardListComponent],
  exports: [
    CardListComponent,
    CardComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
  ],
})
export class CardModule { }
