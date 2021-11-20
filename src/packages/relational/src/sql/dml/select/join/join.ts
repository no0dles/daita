import { ConditionDescription } from '../../../operands/condition-description';
import { JoinDescription } from './join-description';
import { table } from '../../../keyword/table/table';
import { Constructable } from '@daita/common/types/constructable';
import { isTableAliasDescription, TableAliasDescription } from '../table-alias-description';
import { isTableDescription, TableDescription } from '../../../keyword/table/table-description';

export function join<T, R>(
  type: TableDescription<T> | Constructable<T> | TableAliasDescription<T>,
  condition: ConditionDescription,
): JoinDescription {
  if (isTableDescription(type) || isTableAliasDescription(type)) {
    return {
      join: 'inner',
      table: type,
      condition,
    };
  } else {
    return {
      join: 'inner',
      table: table(type),
      condition,
    };
  }
}
