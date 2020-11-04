import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserPoolDetailComponent } from './components/user-pool-detail/user-pool-detail.component';
import { UserPoolDetailUsersComponent } from './components/user-pool-detail-users/user-pool-detail-users.component';
import { UserPoolDetailSettingsComponent } from './components/user-pool-detail-settings/user-pool-detail-settings.component';
import { UserPoolDetailLoadGuard } from './guards/user-pool-detail-load.guard';

const routes: Routes = [
  {
    path: ':userPoolId',
    component: UserPoolDetailComponent,
    canActivate: [UserPoolDetailLoadGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'users' },
      { path: 'users', component: UserPoolDetailUsersComponent },
      { path: 'settings', component: UserPoolDetailSettingsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserPoolDetailRoutingModule {}
