import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserPoolDetailComponent } from './components/user-pool-detail/user-pool-detail.component';
import { UserPoolDetailUsersComponent } from './components/user-pool-detail-users/user-pool-detail-users.component';
import { UserPoolDetailSettingsComponent } from './components/user-pool-detail-settings/user-pool-detail-settings.component';
import { UserPoolDetailRoutingModule } from './user-pool-detail-routing.module';
import { NavbarModule } from '../navbar/navbar.module';
import { FormLayoutModule } from '../form-layout/form-layout.module';
import { ReactiveFormsModule } from '@angular/forms';
import { UserPoolDetailStateModule } from './user-pool-detail-state.module';
import { CardModule } from '../card/card.module';

@NgModule({
  declarations: [UserPoolDetailComponent, UserPoolDetailUsersComponent, UserPoolDetailSettingsComponent],
  providers: [],
  imports: [
    CommonModule,
    UserPoolDetailRoutingModule,
    UserPoolDetailStateModule,
    ReactiveFormsModule,
    NavbarModule,
    FormLayoutModule,
    CardModule,
  ],
})
export class UserPoolDetailModule {}
