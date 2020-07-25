import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { NavbarHeaderComponent } from './components/navbar-header/navbar-header.component';
import { NavbarSubheaderComponent } from './components/navbar-subheader/navbar-subheader.component';


@NgModule({
  declarations: [NavbarComponent, NavbarHeaderComponent, NavbarSubheaderComponent],
  exports: [
    NavbarComponent,
    NavbarHeaderComponent,
    NavbarSubheaderComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
  ],
})
export class NavbarModule {
}
