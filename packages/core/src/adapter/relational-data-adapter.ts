import { RelationalSqlBuilder } from './relational-sql-builder';
import { RelationalTransactionDataAdapter } from './relational-transaction-data-adapter';
import { MigrationSchema } from '../schema/migration-schema';
import { RootFilter } from '../query';
import { RelationalSelectQuery } from './relational-select-query';

export interface RelationalDataAdapter {
  kind: 'dataAdapter';
  insert(schema: MigrationSchema, table: string, data: any[]): Promise<void>;
  update(
    schema: MigrationSchema,
    table: string,
    data: any,
    filter: RootFilter<any> | null,
  ): Promise<{ affectedRows: number }>;
  delete(
    schema: MigrationSchema,
    table: string,
    filter: RootFilter<any> | null,
  ): Promise<{ affectedRows: number }>;
  select(
    schema: MigrationSchema,
    table: string,
    query: RelationalSelectQuery,
  ): Promise<any[]>;
  count(
    schema: MigrationSchema,
    table: string,
    query: RelationalSelectQuery,
  ): Promise<number>;
  raw(sql: string, values: any[]): Promise<{ rowCount: number; rows: any[] }>;
  transaction(
    action: (adapter: RelationalTransactionDataAdapter) => Promise<any>,
  ): Promise<void>;
  sqlBuilder: RelationalSqlBuilder;
}
