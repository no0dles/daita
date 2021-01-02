import {isTableDescription, TableDescription} from '../../keyword/table/table-description';
import {SelectSql} from './select-sql';
import {isExactKind} from '../../../../common/utils/is-exact-kind';
import {failNever} from '../../../../common/utils/fail-never';

export interface TableAliasDescription<T> {
  alias: { name: string; table: TableDescription<T> };
}

export const isTableAliasDescription = (val: any): val is TableAliasDescription<any> =>
  isExactKind<TableAliasDescription<any>>(val, ['alias']);

export function getTableDescription(table: TableDescription<any> | TableAliasDescription<any>): TableDescription<any> {
  if (isTableDescription(table)) {
    return table;
  }
  if (isTableAliasDescription(table)) {
    return table.alias.table;
  }

  failNever(table, 'unknown table');
}
