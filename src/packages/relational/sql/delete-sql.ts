import { Condition } from './description/condition';
import { TableDescription } from './description/table';
import { isKind } from '../../common/utils/is-kind';

export interface DeleteSql {
  delete: TableDescription<any>;
  where?: Condition;
}

export const isDeleteSql = (val: any): val is DeleteSql => isKind<DeleteSql>(val, ['delete']);
