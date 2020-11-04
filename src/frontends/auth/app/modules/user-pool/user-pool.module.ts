import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserPoolListComponent } from './components/user-pool-list/user-pool-list.component';
import { UserPoolRoutingModule } from './user-pool-routing.module';
import { NavbarModule } from '../navbar/navbar.module';
import { SidebarModule } from '../sidebar/sidebar.module';
import { UserPoolCreateComponent } from './components/user-pool-create/user-pool-create.component';
import { CardModule } from '../card/card.module';
import { FormLayoutModule } from '../form-layout/form-layout.module';
import { UserPoolStateModule } from './user-pool-state.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [UserPoolListComponent, UserPoolCreateComponent],
  imports: [
    CommonModule,
    UserPoolRoutingModule,
    NavbarModule,
    SidebarModule,
    CardModule,
    FormLayoutModule,
    UserPoolStateModule,
    ReactiveFormsModule,
  ],
})
export class UserPoolModule {}
