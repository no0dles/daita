import { Condition } from './description/condition';
import { JoinDescription } from './description/join';
import { isKind } from '@daita/common';
import { OrderByDescription } from './description/order-by';
import { ValueType } from './description/value-type';
import { SourceTableDescription } from './description/source-table';

export interface SelectSql<T> {
  select: T;
  from?: SourceTableDescription<any>;
  join?: JoinDescription[];
  where?: Condition
  groupBy?: ValueType[] | ValueType;
  having?: Condition
  orderBy?: ValueType[] | ValueType | OrderByDescription | OrderByDescription[];
  limit?: number | null;
  offset?: number | null;
}

export const isSelectSql = (val: any): val is SelectSql<any> => isKind<SelectSql<any>>(val, ['select']);
