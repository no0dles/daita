import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';

const routes: Routes = [
  {
    path: '', component: AdminComponent, children: [
      { path: '', redirectTo: 'userPools', pathMatch: 'full' },
      {
        path: 'userPools',
        loadChildren: () => import('../user-pool/user-pool.module').then(m => m.UserPoolModule),
      },
      {
        path: 'users',
        loadChildren: () => import('../user/user.module').then(m => m.UserModule),
      },
      {
        path: 'roles',
        loadChildren: () => import('../role/role.module').then(m => m.RoleModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {
}
