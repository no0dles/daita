import { Injectable } from '@angular/core';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { UserPoolDetailLoad } from '../actions/user-pool-detail-load';
import { ApiService } from '../../../services/api.service';
import { UserPool } from '../../../../../../packages/auth-server/models/user-pool';
import { table } from '../../../../../../packages/relational/sql/keyword/table/table';
import { equal } from '../../../../../../packages/relational/sql/operands/comparison/equal/equal';
import { field } from '../../../../../../packages/relational/sql/keyword/field/field';

export interface UserPoolDetailStateModel {
  id: string | null;
  loading: boolean;
  item: UserPoolDetailStateItem | null;
}

export interface UserPoolDetailStateItem {
  name: string;
}

@Injectable()
@State<UserPoolDetailStateModel>({ name: 'userPoolDetail', defaults: { item: null, id: null, loading: false } })
export class UserPoolDetailStateService implements NgxsOnInit {
  @Selector()
  static item(state: UserPoolDetailStateModel) {
    return state.item;
  }

  @Selector()
  static loading(state: UserPoolDetailStateModel) {
    return state.loading;
  }

  constructor(private api: ApiService) {}

  ngxsOnInit(ctx?: StateContext<any>): any {
    console.log('init detail');
  }

  @Action(UserPoolDetailLoad)
  async onLoad(ctx: StateContext<UserPoolDetailStateModel>, action: UserPoolDetailLoad) {
    ctx.patchState({
      loading: true,
    });
    console.log('start sql');
    const result = await this.api.selectFirst({
      select: {
        name: field(UserPool, 'name'),
      },
      from: table(UserPool),
      where: equal(field(UserPool, 'id'), action.userPoolId),
    });
    console.log('set result sql');
    ctx.patchState({
      id: action.userPoolId,
      loading: false,
      item: result,
    });
  }
}
