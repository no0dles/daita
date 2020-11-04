import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserPoolListComponent } from './components/user-pool-list/user-pool-list.component';
import { UserPoolCreateComponent } from './components/user-pool-create/user-pool-create.component';

const routes: Routes = [
  { path: '', component: UserPoolListComponent },
  {
    path: 'detail',
    loadChildren: () => import('../user-pool-detail/user-pool-detail.module').then((m) => m.UserPoolDetailModule),
  },
  { path: 'create', component: UserPoolCreateComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserPoolRoutingModule {}
