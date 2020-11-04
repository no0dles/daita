import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserDetailRoutingModule } from './user-detail-routing.module';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { UserDetailStateModule } from './user-detail-state.module';
import { NavbarModule } from '../navbar/navbar.module';
import { FormLayoutModule } from '../form-layout/form-layout.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [UserDetailComponent],
  imports: [
    CommonModule,
    UserDetailStateModule,
    UserDetailRoutingModule,
    NavbarModule,
    FormLayoutModule,
    ReactiveFormsModule,
  ],
})
export class UserDetailModule {}
