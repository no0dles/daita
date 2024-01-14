import { table } from '@daita/relational';
import { RelationalDropTableFieldMigrationStep } from './relational-drop-table-field.migration-step';
import { AlterTableDropColumnSql } from '@daita/relational';

export function dropTableField(step: RelationalDropTableFieldMigrationStep): AlterTableDropColumnSql {
  return {
    alterTable: table(step.table, step.schema),
    drop: {
      column: step.fieldName,
    },
  };
}
