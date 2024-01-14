import { Injectable } from '@angular/core';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { UserPoolDetailLoad } from '../actions/user-pool-detail-load';
import { ApiService } from '../../../services/api.service';
import { equal, field, table } from '@daita/relational';
import { UserPool } from '@daita/auth';

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

  ngxsOnInit(ctx?: StateContext<any>): any {}

  @Action(UserPoolDetailLoad)
  async onLoad(ctx: StateContext<UserPoolDetailStateModel>, action: UserPoolDetailLoad) {
    ctx.patchState({
      loading: true,
    });
    const result = await this.api.selectFirst({
      select: {
        name: field(UserPool, 'name'),
      },
      from: table(UserPool),
      where: equal(field(UserPool, 'id'), action.userPoolId),
    });
    ctx.patchState({
      id: action.userPoolId,
      loading: false,
      item: result,
    });
  }
}
