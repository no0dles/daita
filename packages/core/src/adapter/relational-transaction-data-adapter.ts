import { RootFilter } from '../query';
import { RelationalSelectQuery } from './relational-select-query';
import { MigrationSchema } from '../schema/migration-schema';

export interface RelationalTransactionDataAdapter {
  kind: 'transactionDataAdapter';
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
}
