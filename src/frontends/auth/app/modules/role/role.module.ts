import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleListComponent } from './components/role-list/role-list.component';
import { NavbarModule } from '../navbar/navbar.module';
import { RoleRoutingModule } from './role-routing.module';
import { SidebarModule } from '../sidebar/sidebar.module';
import { RoleCreateComponent } from './components/role-create/role-create.component';
import { FormLayoutModule } from '../form-layout/form-layout.module';
import { CardModule } from '../card/card.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [RoleListComponent, RoleCreateComponent],
  imports: [
    CommonModule,
    NavbarModule,
    RoleRoutingModule,
    SidebarModule,
    FormLayoutModule,
    CardModule,
    ReactiveFormsModule,
  ],
})
export class RoleModule {}
