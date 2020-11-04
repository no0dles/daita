import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { UserDetailLoadGuard } from './guards/user-detail-load.guard';

const routes: Routes = [{ path: '', component: UserDetailComponent, canActivate: [UserDetailLoadGuard] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserDetailRoutingModule {}
