import { AlterTableAddForeignKeySql, RelationalTransactionAdapter } from '@daita/relational';
import { RelationalUpdateTableForeignKeyMigrationStep } from './update-table-foreign-key.migration-step';

export function updateTableForeignKeyAction(
  client: RelationalTransactionAdapter<AlterTableAddForeignKeySql<any>>,
  step: RelationalUpdateTableForeignKeyMigrationStep,
) {}
