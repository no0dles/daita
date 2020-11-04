import { Component } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { UserPoolStateItem, UserPoolStateService } from '../../services/user-pool-state.service';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-pool-list',
  templateUrl: './user-pool-list.component.html',
  styleUrls: ['./user-pool-list.component.scss'],
})
export class UserPoolListComponent {
  @Select(UserPoolStateService.items)
  userPools$!: Observable<UserPoolStateItem[]>;

  @Select(UserPoolStateService.loading)
  loading$!: Observable<boolean>;

  constructor(private api: ApiService) {}
}
