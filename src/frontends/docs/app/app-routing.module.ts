import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{ path: '', pathMatch: 'full', redirectTo: 'app' }];

@NgModule({
  imports: [RouterModule.forRoot(routes, { paramsInheritanceStrategy: 'always' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
