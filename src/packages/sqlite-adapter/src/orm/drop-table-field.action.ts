import { RelationalDropTableFieldMigrationStep } from '@daita/orm';
import { AlterTableDropColumnSql, table } from '@daita/relational';

export function dropTableFieldAction(step: RelationalDropTableFieldMigrationStep): AlterTableDropColumnSql {
  return {
    alterTable: table(step.table, step.schema),
    drop: {
      column: step.fieldName,
    },
  };
}
