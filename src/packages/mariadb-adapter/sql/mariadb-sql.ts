import { Sql } from '../../relational/sql/sql';
import { LockTableSql } from '../../relational/sql/ddl/lock-table/lock-table-sql';
import { DropTableSql } from '../../relational/sql/ddl/drop-table/drop-table-sql';
import { AlterTableAddColumnSql } from '../../relational/sql/ddl/alter-table/alter-table-sql';
import { CreateTableSql } from '../../relational/sql/ddl/create-table/create-table-sql';
import { CreateSchemaSql } from '../../relational/sql/ddl/create-schema/create-schema-sql';
import { DropIndexSql } from '../../relational/sql/ddl/drop-index/drop-index-sql';
import { CreateIndexSql } from '../../relational/sql/ddl/create-index/create-index-sql';
import { CreateViewSql } from '../../relational/sql/ddl/create-view/create-view-sql';
import { DropViewSql } from '../../relational/sql/ddl/drop-view/drop-view-sql';

export type MariadbSql =
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
