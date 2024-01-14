import { AlterTableDropColumnSql, AlterTableRenameSql, Sql } from '@daita/relational';
import { CreateIndexSql } from '@daita/relational';
import { DropTableSql } from '@daita/relational';
import { AlterTableAddColumnSql } from '@daita/relational';
import { DropIndexSql } from '@daita/relational';
import { CreateViewSql } from '@daita/relational';
import { DropViewSql } from '@daita/relational';
import { CreateTableSql } from '@daita/relational';
import { LockTableSql } from '@daita/relational';
import { CreateSchemaSql } from '@daita/relational';
import { PragmaSql } from './pragma-sql';

export type SqliteSql =
  | Sql<any>
  | LockTableSql
  | DropTableSql
  | AlterTableAddColumnSql
  | AlterTableDropColumnSql
  | AlterTableRenameSql
  | CreateTableSql
  | CreateSchemaSql
  | DropIndexSql
  | CreateIndexSql<any>
  | CreateViewSql<any>
  | DropViewSql
  | PragmaSql;
