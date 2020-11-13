import { Sql } from '../../relational/sql/sql';
import {
  AlterTableAddColumnSql,
  AlterTableAddForeignKeySql,
  CreateIndexSql,
  CreateSchemaSql,
  CreateTableSql,
  CreateViewSql,
  DropIndexSql,
  DropTableSql,
  DropViewSql,
  LockTableSql,
} from '../../relational';

export type SqliteSql =
  | Sql<any>
  | LockTableSql
  | DropTableSql
  | AlterTableAddColumnSql
  | AlterTableAddForeignKeySql<string>
  | AlterTableAddForeignKeySql<string[]>
  | CreateTableSql
  | CreateSchemaSql
  | DropIndexSql
  | CreateIndexSql<any>
  | CreateViewSql<any>
  | DropViewSql;
