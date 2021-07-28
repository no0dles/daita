import { TableDescription } from '../../relational/sql/keyword/table/table-description';

export type PostgresAlterTableSql =
  | PostgresAlterTableColumnTypeSql
  | PostgresAlterTableSetSql
  | PostgresAlterTableDropSql;

export interface PostgresAlterTableColumnTypeSql {
  alterTable: TableDescription<any>;
  alterColumn: {
    type: string;
  };
}
export interface PostgresAlterTableSetSql {
  alterTable: TableDescription<any>;
  alterColumn: {
    set: 'not null' | { default: any };
  };
}
export interface PostgresAlterTableDropSql {
  alterTable: TableDescription<any>;
  alterColumn: {
    drop: 'not null' | 'default';
  };
}
