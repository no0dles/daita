import { ForeignKeyConstraint } from '@daita/relational';

export interface RelationalAddTableForeignKeyMigrationStep {
  kind: 'add_table_foreign_key';
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
