import { TableAliasDescription } from '../../dml/select/table-alias-description';
import { table } from '../table/table';
import { SelectSql } from '../../dml/select/select-sql';
import { Constructable } from '../../../../common/types/constructable';

export function alias<T>(type: Constructable<T> | SelectSql<T>, alias: string): TableAliasDescription<T> {
  if (typeof type === 'function') {
    return { alias: { name: alias, table: table(type) } };
  } else {
    return { alias: { name: alias, table: type } };
  }
}
