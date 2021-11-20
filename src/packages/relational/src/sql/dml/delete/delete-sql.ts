import { ConditionDescription } from '../../operands/condition-description';
import { TableDescription } from '../../keyword/table/table-description';
import { isKind } from '@daita/common/utils/is-kind';

export interface DeleteSql {
  delete: TableDescription<any>;
  where?: ConditionDescription;
}

export const isDeleteSql = (val: any): val is DeleteSql => isKind<DeleteSql>(val, ['delete']);
