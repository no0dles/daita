import { TableAliasDescription } from '../../dml/select/table-alias-description';
import { table } from '../table/table';
import { Constructable } from '@daita/common';
import { TableDescription } from '../table/table-description';

export function alias<T>(
  type: Constructable<T> | TableDescription<T>,
  alias: string,
): TableAliasDescription<T> {
  if (typeof type === 'function') {
    return { alias: { name: alias, table: table(type) } };
  } else {
    return { alias: { name: alias, table: type } };
  }
}
