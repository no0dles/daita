import { TableAliasDescription } from './table-alias-description';
import { TableDescription } from '../../keyword/table/table-description';
import { SelectSql } from './select-sql';

export type SourceTableDescription<T> = TableDescription<T> | TableAliasDescription<T> | SelectSql<T>;
