import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import {
  UserPoolDetailUsersStateService,
  UserPoolDetailUserStateItem,
} from '../../services/user-pool-detail-users-state.service';
import { Select } from '@ngxs/store';

@Component({
  selector: 'app-user-pool-detail-users',
  templateUrl: './user-pool-detail-users.component.html',
  styleUrls: ['./user-pool-detail-users.component.scss'],
})
export class UserPoolDetailUsersComponent {
  @Select(UserPoolDetailUsersStateService.items)
  users$!: Observable<UserPoolDetailUserStateItem[]>;
}
