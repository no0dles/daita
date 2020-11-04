import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { NavbarHeaderComponent } from './components/navbar-header/navbar-header.component';
import { NavbarSubheaderComponent } from './components/navbar-subheader/navbar-subheader.component';
import { NavbarTabsComponent } from './components/navbar-tabs/navbar-tabs.component';
import { NavbarTabComponent } from './components/navbar-tab/navbar-tab.component';

@NgModule({
  declarations: [
    NavbarComponent,
    NavbarHeaderComponent,
    NavbarSubheaderComponent,
    NavbarTabsComponent,
    NavbarTabComponent,
  ],
  exports: [NavbarComponent, NavbarHeaderComponent, NavbarSubheaderComponent, NavbarTabsComponent, NavbarTabComponent],
  imports: [CommonModule, RouterModule],
})
export class NavbarModule {}
