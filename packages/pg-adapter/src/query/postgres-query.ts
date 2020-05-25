import { PostgresFieldType } from './dml/postgres-field-type';
import { SqlAlterTableAddColumn } from '@daita/relational/dist/sql/ddl/alter-table/alter-table-add-column-query';
import { SqlCreateTableQuery } from '@daita/relational/dist/sql/ddl/create-table/create-table-query';
import { isSqlQuery, SqlDelete, SqlInsert, SqlSelect, SqlUpdate } from '@daita/relational';

export type PostgresQuery =
  SqlUpdate
  | SqlInsert
  | SqlDelete
  | SqlSelect
  | SqlCreateTableQuery<PostgresFieldType>
  | SqlAlterTableAddColumn<PostgresFieldType>;

export const isPostgresQuery = (val: any): val is PostgresQuery => isSqlQuery(val);
