import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { UserPoolDetailStateService } from './services/user-pool-detail-state.service';
import { UserPoolDetailUsersStateService } from './services/user-pool-detail-users-state.service';

@NgModule({
  providers: [UserPoolDetailStateService],
  imports: [NgxsModule.forFeature([UserPoolDetailStateService, UserPoolDetailUsersStateService])],
})
export class UserPoolDetailStateModule {}
