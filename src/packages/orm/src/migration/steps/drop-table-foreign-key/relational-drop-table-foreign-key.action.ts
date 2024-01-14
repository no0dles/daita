import { RelationalDropTableForeignKeyMigrationStep } from './relational-drop-table-foreign-key.migration-step';
import { table } from '@daita/relational';
import { AlterTableDropConstraintSql } from '@daita/relational';

export function dropTableForeignKeyAction(
  step: RelationalDropTableForeignKeyMigrationStep,
): AlterTableDropConstraintSql {
  return {
    alterTable: table(step.table, step.schema),
    drop: {
      constraint: step.name,
    },
  };
}
