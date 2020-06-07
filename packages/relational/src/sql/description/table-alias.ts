import { TableDescription } from './table';
import { isExactKind } from '@daita/common';
import { SelectSql } from '../select-sql';

export interface TableAliasDescription<T> {
  alias: { name: string, table: TableDescription<T> | SelectSql<T> }
}

export const isTableAliasDescription = (val: any): val is TableAliasDescription<any> => isExactKind<TableAliasDescription<any>>(val, ['alias']);
