import { NgModule } from '@angular/core';
import { UserPoolStateService } from './services/user-pool-state.service';
import { NgxsModule } from '@ngxs/store';

@NgModule({
  providers: [UserPoolStateService],
  imports: [NgxsModule.forFeature([UserPoolStateService])],
})
export class UserPoolStateModule {}
