import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { UserDetailStateService } from './services/user-detail-state.service';

@NgModule({
  providers: [UserDetailStateService],
  imports: [NgxsModule.forFeature([UserDetailStateService])],
})
export class UserDetailStateModule {}
