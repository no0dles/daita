import { TableAliasDescription } from '../description/table-alias';
import { Constructable } from '@daita/common';
import { table } from './table';
import { SelectSql } from '../select-sql';

export function alias<T>(type: Constructable<T> | SelectSql<T>, alias: string): TableAliasDescription<T> {
  if (typeof type === 'function') {
    return { alias: { name: alias, table: table(type) } };
  } else {
    return { alias: { name: alias, table: type } };
  }
}
