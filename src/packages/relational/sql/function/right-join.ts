import { Condition } from '../description/condition';
import { JoinDescription } from '../description/join';
import { table } from './table';
import { isTableAliasDescription, isTableDescription, TableAliasDescription, TableDescription } from '../description';
import {Constructable} from '../../../common/types';

export function rightJoin<T, R>(type: Constructable<T> | TableDescription<T> | TableAliasDescription<T>, condition: Condition): JoinDescription {
  if (isTableDescription(type) || isTableAliasDescription(type)) {
    return {
      join: 'right',
      table: type,
      condition,
    };
  } else {
    return {
      join: 'right',
      table: table(type),
      condition,
    };
  }
}
