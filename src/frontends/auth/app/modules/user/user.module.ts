import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './components/user-list/user-list.component';
import { NavbarModule } from '../navbar/navbar.module';
import { UserRoutingModule } from './user-routing.module';
import { SidebarModule } from '../sidebar/sidebar.module';
import { UserCreateComponent } from './components/user-create/user-create.component';
import { FormLayoutModule } from '../form-layout/form-layout.module';
import { CardModule } from '../card/card.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [UserListComponent, UserCreateComponent],
  imports: [
    CommonModule,
    NavbarModule,
    UserRoutingModule,
    SidebarModule,
    FormLayoutModule,
    CardModule,
    ReactiveFormsModule,
  ],
})
export class UserModule {}
