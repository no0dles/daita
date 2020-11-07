import { ConditionDescription } from '../../operands/condition-description';
import { JoinDescription } from './join/join-description';
import { OrderByDescription } from './order-by/order-by-description';
import { ValueType } from '../../operands/value-type';
import { SourceTableDescription } from './source-table';
import { isKind } from '../../../../common/utils/is-kind';

export interface SelectSql<T> {
  select: T;
  from?: SourceTableDescription<any>;
  join?: JoinDescription[];
  where?: ConditionDescription;
  groupBy?: ValueType[] | ValueType;
  having?: ConditionDescription;
  orderBy?: ValueType | OrderByDescription | (OrderByDescription | ValueType)[];
  limit?: number | null;
  offset?: number | null;
}

export const isSelectSql = (val: any): val is SelectSql<any> => isKind<SelectSql<any>>(val, ['select']);
