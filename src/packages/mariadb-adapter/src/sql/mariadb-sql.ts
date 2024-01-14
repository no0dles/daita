import { Sql } from '@daita/relational';
import { LockTableSql } from '@daita/relational';
import { DropTableSql } from '@daita/relational';
import { AlterTableSql } from '@daita/relational';
import { CreateTableSql } from '@daita/relational';
import { CreateSchemaSql } from '@daita/relational';
import { DropIndexSql } from '@daita/relational';
import { CreateIndexSql } from '@daita/relational';
import { CreateViewSql } from '@daita/relational';
import { DropViewSql } from '@daita/relational';

export type MariadbSql =
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
