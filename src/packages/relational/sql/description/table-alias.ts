import { TableDescription } from './table';
import { SelectSql } from '../select-sql';
import {isExactKind} from '../../../common/utils';

export interface TableAliasDescription<T> {
  alias: { name: string, table: TableDescription<T> | SelectSql<T> }
}

export const isTableAliasDescription = (val: any): val is TableAliasDescription<any> => isExactKind<TableAliasDescription<any>>(val, ['alias']);
