import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthorizedGuard } from './guards/authorized.guard';
import { UnauthorizedGuard } from './guards/unauthorized.guard';

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'app'},
  {
    path: 'login',
    canActivate: [UnauthorizedGuard],
    loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule),
  },
  {
    path: 'app',
    canActivate: [AuthorizedGuard],
    loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
