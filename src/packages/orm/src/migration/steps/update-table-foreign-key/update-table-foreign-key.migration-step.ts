import { ForeignKeyConstraint } from '../../../schema';

export interface RelationalUpdateTableForeignKeyMigrationStep {
  kind: 'update_table_foreign_key';
  table: string;
  schema?: string;
  name: string;
  fieldNames: string[];
  foreignTable: string;
  foreignTableSchema?: string;
  foreignFieldNames: string[];
  required: boolean;
  onDelete?: ForeignKeyConstraint;
  onUpdate?: ForeignKeyConstraint;
}
