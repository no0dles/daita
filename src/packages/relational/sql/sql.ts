import { CreateSchemaSql } from './ddl/create-schema/create-schema-sql';
import { CreateTableSql } from './ddl/create-table/create-table-sql';
import { AlterTableSql } from './ddl/alter-table/alter-table-sql';
import { DropTableSql } from './ddl/drop-table/drop-table-sql';
import { LockTableSql } from './ddl/lock-table/lock-table-sql';
import { InsertSql } from './dml/insert/insert-sql';
import { UpdateSql } from './dml/update/update-sql';
import { DeleteSql } from './dml/delete/delete-sql';
import { SelectSql } from './dml/select/select-sql';
import { DropIndexSql } from './ddl/drop-index/drop-index-sql';
import { CreateIndexSql } from './ddl/create-index/create-index-sql';
import { CreateViewSql } from './ddl/create-view/create-view-sql';
import { DropViewSql } from './ddl/drop-view/drop-view-sql';

export type Sql<T> =
  | SelectSql<T>
  | DeleteSql
  | UpdateSql<T>
  | InsertSql<T>
  | LockTableSql
  | DropTableSql
  | AlterTableSql
  | CreateTableSql
  | CreateSchemaSql
  | DropIndexSql
  | CreateIndexSql<T>
  | CreateViewSql<T>
  | DropViewSql;
