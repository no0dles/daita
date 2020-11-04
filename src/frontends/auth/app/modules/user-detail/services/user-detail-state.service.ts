import { Injectable } from '@angular/core';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { ApiService } from '../../../services/api.service';
import { field } from '../../../../../../packages/relational/sql/function/field';
import { table } from '../../../../../../packages/relational/sql/function/table';
import { equal } from '../../../../../../packages/relational/sql/function/equal';
import { UserDetailLoad } from '../actions/user-detail-load';
import { User } from '../../../../../../packages/auth/models/user';
import { and } from '../../../../../../packages/relational/sql/function/and';
import { UserPool } from '../../../../../../packages/auth/models/user-pool';
import { join } from '../../../../../../packages/relational/sql/function/join';
import { UserRole } from '../../../../../../packages/auth/models/user-role';
import { Role } from '../../../../../../packages/auth/models/role';
import { leftJoin } from '../../../../../../packages/relational/sql/function/left-join';

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
          UserRole,
          and(
            equal(field(UserRole, 'roleUserPoolId'), field(Role, 'userPoolId')),
            equal(field(UserRole, 'roleName'), field(Role, 'name')),
          ),
        ),
        leftJoin(UserPool, equal(field(UserPool, 'id'), field(UserRole, 'roleUserPoolId'))),
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
