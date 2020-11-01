import { Condition } from './description/condition';
import { JoinDescription } from './description/join';
import { OrderByDescription } from './description/order-by';
import { ValueType } from './description/value-type';
import { SourceTableDescription } from './description/source-table';
import { isKind } from '../../common/utils/is-kind';

export interface SelectSql<T> {
  select: T;
  from?: SourceTableDescription<any>;
  join?: JoinDescription[];
  where?: Condition;
  groupBy?: ValueType[] | ValueType;
  having?: Condition;
  orderBy?: ValueType | OrderByDescription | (OrderByDescription | ValueType)[];
  limit?: number | null;
  offset?: number | null;
}

export const isSelectSql = (val: any): val is SelectSql<any> => isKind<SelectSql<any>>(val, ['select']);
