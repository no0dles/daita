import { ForeignKeyConstraint } from '@daita/relational';
import { MigrationStep } from '../../migration-step';

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

export const isAddTableForeignKeyStep = (val: MigrationStep): val is RelationalAddTableForeignKeyMigrationStep =>
  val.kind === 'add_table_foreign_key';
