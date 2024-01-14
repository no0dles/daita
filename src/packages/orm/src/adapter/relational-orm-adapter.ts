import { SchemaTableFieldTypeDescription } from '../schema';

export interface RelationalOrmAdapter {
  getDatabaseType(type: SchemaTableFieldTypeDescription, size?: string): string;
  //getSchemaType(type: string): SchemaDataType;
}

export const isOrmAdapter = (val: any): val is RelationalOrmAdapter =>
  !!val && typeof val.getAppliedMigrations === 'function' && typeof val.applyMigration === 'function';

export type MigrationDirection = 'forward' | 'reverse';
