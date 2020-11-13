import { PostgresListenSql } from './listen-sql';
import { PostgresNotifySql } from './notify-sql';
import { Sql } from '../../relational/sql/sql';
import {
  AlterTableSql,
  CreateIndexSql,
  CreateSchemaSql,
  CreateTableSql,
  CreateViewSql,
  DropIndexSql,
  DropTableSql,
  DropViewSql,
  LockTableSql,
} from '../../relational';

export type PostgresSql =
  | PostgresListenSql
  | PostgresNotifySql
  | Sql<any>
  | LockTableSql
  | DropTableSql
  | AlterTableSql
  | CreateTableSql
  | CreateSchemaSql
  | DropIndexSql
  | CreateIndexSql<any>
  | CreateViewSql<any>
  | DropViewSql;
