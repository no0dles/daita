import {
  AlterTableSql,
  CreateIndexSql,
  CreateTableSql,
  CreateViewSql,
  DeleteSql,
  DropIndexSql,
  DropTableSql,
  DropViewSql,
  InsertSql,
  UpdateSql,
} from '@daita/relational';

export type OrmSql =
  | CreateTableSql
  | CreateViewSql<any>
  | AlterTableSql
  | CreateIndexSql<any>
  | DropIndexSql
  | DropTableSql
  | DropViewSql
  | InsertSql<any>
  | UpdateSql<any>
  | DeleteSql;
