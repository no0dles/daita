import { TableAliasDescription } from './table-alias';
import { TableDescription } from './table';
import { SelectSql } from '../select-sql';

export type SourceTableDescription<T> = TableDescription<T> | TableAliasDescription<T> | SelectSql<T>;
