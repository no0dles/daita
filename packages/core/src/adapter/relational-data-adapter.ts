import { MigrationSchema } from '../schema/migration-schema';
import { RootFilter } from '../query';
import { RelationalSelectQuery } from './relational-select-query';
import {RelationalAdapter} from './relational-adapter';

export interface RelationalDataAdapter extends RelationalAdapter {
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
