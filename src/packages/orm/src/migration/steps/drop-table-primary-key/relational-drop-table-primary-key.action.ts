import { RelationalDropTablePrimaryKeyMigrationStep } from './relational-drop-table-primary-key.migration-step';
import { table } from '@daita/relational';
import { AlterTableDropConstraintSql } from '@daita/relational';

export function dropTablePrimaryKeyAction(
  step: RelationalDropTablePrimaryKeyMigrationStep,
): AlterTableDropConstraintSql {
  return {
    alterTable: table(step.table, step.schema),
    drop: {
      constraint: `${step.table}_pkey`,
    },
  };
}
