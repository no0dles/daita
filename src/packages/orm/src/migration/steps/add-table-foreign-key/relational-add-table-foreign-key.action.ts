import { RelationalAddTableForeignKeyMigrationStep } from './relational-add-table-foreign-key.migration-step';
import { AlterTableAddForeignKeySql, table } from '@daita/relational';

export function addTableForeignKeyAction(
  step: RelationalAddTableForeignKeyMigrationStep,
): AlterTableAddForeignKeySql<any> {
  return {
    alterTable: table(step.table, step.schema),
    add: {
      constraint: step.name,
      foreignKey: step.fieldNames,
      references: {
        table: table(step.foreignTable, step.foreignTableSchema),
        primaryKeys: step.foreignFieldNames,
      },
      onUpdate: step.onUpdate,
      onDelete: step.onDelete,
    },
  };
}
