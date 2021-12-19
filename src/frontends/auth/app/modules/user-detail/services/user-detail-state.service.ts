import { Injectable } from '@angular/core';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { ApiService } from '../../../services/api.service';
import { UserDetailLoad } from '../actions/user-detail-load';
import { equal, field, join, leftJoin, table, and } from '@daita/relational';
import { Role, User, UserPool, UserRole } from '@daita/auth';

export interface UserDetailStateModel {
  id: string | null;
  loading: boolean;
  item: UserDetailStateItem | null;
  roles: UserDetailRoleItem[];
  loadingRoles: boolean;
}

export interface UserDetailRoleItem {
  name: string;
  assigned: boolean;
}

export interface UserDetailStateItem {
  username: string;
  email?: string;
  emailVerified?: boolean;
  userPoolId: string;
  userPool: string;
  phone?: string;
  phoneVerified?: boolean;
}

@Injectable()
@State<UserDetailStateModel>({
  name: 'userDetail',
  defaults: { item: null, id: null, loading: false, roles: [], loadingRoles: false },
})
export class UserDetailStateService implements NgxsOnInit {
  @Selector()
  static item(state: UserDetailStateModel) {
    return state.item;
  }

  @Selector()
  static loading(state: UserDetailStateModel) {
    return state.loading;
  }

  constructor(private api: ApiService) {}

  ngxsOnInit(ctx?: StateContext<any>): any {
    console.log('init user detail');
  }

  @Action(UserDetailLoad)
  async onLoadRoles(ctx: StateContext<UserDetailStateModel>, action: UserDetailLoad) {
    ctx.patchState({
      loadingRoles: true,
    });
    const result = await this.api.select({
      select: {
        username: field(User, 'username'),
        email: field(User, 'email'),
        userPoolId: field(User, 'userPoolId'),
        emailVerified: field(User, 'emailVerified'),
        phoneVerified: field(User, 'phoneVerified'),
        phone: field(User, 'phone'),
        userPool: field(UserPool, 'name'),
      },
      from: table(Role),
      join: [
        leftJoin(
          table(UserRole),
          and(
            equal(field(UserRole, 'roleUserPoolId'), field(Role, 'userPoolId')),
            equal(field(UserRole, 'roleName'), field(Role, 'name')),
          ),
        ),
        join(table(User), equal(field(User, 'username'), field(UserRole, 'userUsername'))),
        leftJoin(table(UserPool), equal(field(UserPool, 'id'), field(UserRole, 'roleUserPoolId'))),
      ],
      where: and(
        equal(field(UserRole, 'userUsername'), action.username),
        equal(field(UserPool, 'id'), action.userPoolId),
      ),
    });
    console.log(result);
  }

  @Action(UserDetailLoad)
  async onLoadUser(ctx: StateContext<UserDetailStateModel>, action: UserDetailLoad) {
    ctx.patchState({
      loading: true,
    });
    const result = await this.api.selectFirst({
      select: {
        username: field(User, 'username'),
        email: field(User, 'email'),
        userPoolId: field(User, 'userPoolId'),
        emailVerified: field(User, 'emailVerified'),
        phoneVerified: field(User, 'phoneVerified'),
        phone: field(User, 'phone'),
        userPool: field(UserPool, 'name'),
      },
      from: table(User),
      join: [join(UserPool, equal(field(UserPool, 'id'), field(User, 'userPoolId')))],
      where: and(equal(field(User, 'username'), action.username), equal(field(User, 'userPoolId'), action.userPoolId)),
    });
    ctx.patchState({
      id: action.username,
      loading: false,
      item: result,
    });
  }
}
