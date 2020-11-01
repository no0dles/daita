import { Condition } from '../description/condition';
import { JoinDescription } from '../description/join';
import { table } from './table';
import { Constructable } from '../../../common/types';
import { isTableAliasDescription, TableAliasDescription } from '../description/table-alias';
import { isTableDescription, TableDescription } from '../description/table';

export function join<T, R>(
  type: TableDescription<T> | Constructable<T> | TableAliasDescription<T>,
  condition: Condition,
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
