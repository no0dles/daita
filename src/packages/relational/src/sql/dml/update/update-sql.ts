import { ConditionDescription } from '../../operands/condition-description';
import { TableDescription } from '../../keyword/table/table-description';
import { isKind } from '@daita/common/utils/is-kind';

export interface UpdateSql<T> {
  update: TableDescription<T>;
  set: Partial<T>;
  where?: ConditionDescription;
}

export const isUpdateSql = (val: any): val is UpdateSql<any> => isKind<UpdateSql<any>>(val, ['update', 'set']);
