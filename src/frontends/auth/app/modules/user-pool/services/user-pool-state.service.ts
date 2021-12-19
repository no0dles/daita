import { Injectable } from '@angular/core';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { UserPoolLoad } from '../actions/user-pool-load';
import { ApiService } from '../../../services/api.service';
import { count, equal, field, subSelect, table } from '@daita/relational';
import { User, UserPool } from '@daita/auth';

export interface UserPoolStateItem {
  id: string;
  name: string;
  userCount: number;
}

export interface UserPoolStateModel {
  items: UserPoolStateItem[];
  loading: boolean;
}

@Injectable()
@State<UserPoolStateModel>({ name: 'userPool', defaults: { items: [], loading: false } })
export class UserPoolStateService implements NgxsOnInit {
  @Selector()
  static loading(state: UserPoolStateModel) {
    return state.loading;
  }

  @Selector()
  static items(state: UserPoolStateModel) {
    return state.items;
  }

  constructor(private api: ApiService) {}

  ngxsOnInit(ctx?: StateContext<UserPoolStateModel>): any {
    console.log('init');
    ctx?.dispatch(new UserPoolLoad());
  }

  @Action(UserPoolLoad)
  async onLoad(ctx: StateContext<UserPoolStateModel>) {
    if (ctx.getState().loading) {
      return;
    }

    ctx.patchState({ loading: true });
    const items = await this.api.select({
      select: {
        id: field(UserPool, 'id'),
        name: field(UserPool, 'name'),
        userCount: subSelect({
          select: count(),
          from: table(User),
          where: equal(field(User, 'userPoolId'), field(UserPool, 'id')),
        }),
      },
      from: table(UserPool),
    });
    ctx.patchState({ loading: false, items });
  }
}
