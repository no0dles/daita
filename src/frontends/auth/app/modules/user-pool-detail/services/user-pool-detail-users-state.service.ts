import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { ApiService } from '../../../services/api.service';
import { UserPoolDetailLoad } from '../actions/user-pool-detail-load';
import { equal, field, table } from '@daita/relational';
import { User } from '@daita/auth';

export interface UserPoolDetailUsersStateModel {
  loading: boolean;
  items: UserPoolDetailUserStateItem[];
}

export interface UserPoolDetailUserStateItem {
  username: string;
  email?: string;
  disabled: boolean;
  userPoolId: string;
}

@Injectable()
@State<UserPoolDetailUsersStateModel>({
  name: 'userPoolDetailUsers',
  defaults: { items: [], loading: false },
})
export class UserPoolDetailUsersStateService {
  @Selector()
  static items(state: UserPoolDetailUsersStateModel) {
    return state.items;
  }

  @Selector()
  static loading(state: UserPoolDetailUsersStateModel) {
    return state.loading;
  }

  constructor(private api: ApiService) {}

  @Action(UserPoolDetailLoad)
  async onLoad(ctx: StateContext<UserPoolDetailUsersStateModel>, action: UserPoolDetailLoad) {
    ctx.patchState({
      loading: true,
    });
    const result = await this.api.select({
      select: {
        username: field(User, 'username'),
        email: field(User, 'email'),
        disabled: field(User, 'disabled'),
        userPoolId: field(User, 'userPoolId'),
      },
      from: table(User),
      where: equal(field(User, 'userPoolId'), action.userPoolId),
    });
    ctx.patchState({
      loading: false,
      items: result,
    });
  }
}
