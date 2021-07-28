import { PostgresListenSql } from './listen-sql';
import { PostgresNotifySql } from './notify-sql';
import { Sql } from '../../relational/sql/sql';
import { PostgresUnlistenSql } from './unlisten-sql';
import { CreateIndexSql } from '../../relational/sql/ddl/create-index/create-index-sql';
import { AlterTableSql } from '../../relational/sql/ddl/alter-table/alter-table-sql';
import { DropTableSql } from '../../relational/sql/ddl/drop-table/drop-table-sql';
import { DropIndexSql } from '../../relational/sql/ddl/drop-index/drop-index-sql';
import { CreateViewSql } from '../../relational/sql/ddl/create-view/create-view-sql';
import { DropViewSql } from '../../relational/sql/ddl/drop-view/drop-view-sql';
import { CreateTableSql } from '../../relational/sql/ddl/create-table/create-table-sql';
import { LockTableSql } from '../../relational/sql/ddl/lock-table/lock-table-sql';
import { CreateSchemaSql } from '../../relational/sql/ddl/create-schema/create-schema-sql';
import { PostgresAlterTableSql } from './alter-table-sql';

export type PostgresSql =
  | PostgresListenSql
  | PostgresNotifySql
  | PostgresUnlistenSql
  | Sql<any>
  | LockTableSql
  | DropTableSql
  | AlterTableSql
  | PostgresAlterTableSql
  | CreateTableSql
  | CreateSchemaSql
  | DropIndexSql
  | CreateIndexSql<any>
  | CreateViewSql<any>
  | DropViewSql;
