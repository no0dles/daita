import { Sql } from '@daita/relational/sql/sql';
import { CreateIndexSql } from '@daita/relational/sql/ddl/create-index/create-index-sql';
import { DropTableSql } from '@daita/relational/sql/ddl/drop-table/drop-table-sql';
import { AlterTableAddColumnSql } from '@daita/relational/sql/ddl/alter-table/alter-table-sql';
import { DropIndexSql } from '@daita/relational/sql/ddl/drop-index/drop-index-sql';
import { CreateViewSql } from '@daita/relational/sql/ddl/create-view/create-view-sql';
import { DropViewSql } from '@daita/relational/sql/ddl/drop-view/drop-view-sql';
import { CreateTableSql } from '@daita/relational/sql/ddl/create-table/create-table-sql';
import { LockTableSql } from '@daita/relational/sql/ddl/lock-table/lock-table-sql';
import { CreateSchemaSql } from '@daita/relational/sql/ddl/create-schema/create-schema-sql';

export type SqliteSql =
  | Sql<any>
  | LockTableSql
  | DropTableSql
  | AlterTableAddColumnSql
  | CreateTableSql
  | CreateSchemaSql
  | DropIndexSql
  | CreateIndexSql<any>
  | CreateViewSql<any>
  | DropViewSql;
