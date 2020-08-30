import { Condition } from './description/condition';
import { TableDescription } from './description/table';
import {isKind} from '../../common/utils';

export interface UpdateSql<T> {
  update: TableDescription<T>;
  set: Partial<T>;
  where?: Condition;
}

export const isUpdateSql = (val: any): val is UpdateSql<any> => isKind<UpdateSql<any>>(val, ['update', 'set']);
