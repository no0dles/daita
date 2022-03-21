import { RelationalAddTableFieldMigrationStep } from './relational-add-table-field.migration-step';
import { table } from '@daita/relational';
import { AlterTableAddColumnSql } from '@daita/relational';

export function addTableFieldAction(step: RelationalAddTableFieldMigrationStep): AlterTableAddColumnSql {
  return {
    alterTable: table(step.table, step.schema),
    add: {
      column: step.fieldName,
      type: step.type,
    },
  };
}
