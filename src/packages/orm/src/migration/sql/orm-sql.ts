import { AlterTableSql, CreateTableSql, CreateViewSql, DropTableSql, DropViewSql } from '@daita/relational';

export type OrmSql = CreateTableSql | CreateViewSql<any> | AlterTableSql | DropTableSql | DropViewSql;
