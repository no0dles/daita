import { RelationalAddTablePrimaryKey } from './relational-add-table-primary-key.migration-step';
import { AlterTableAddPrimaryKeySql, table } from '@daita/relational';

export function addTablePrimaryKeyAction(step: RelationalAddTablePrimaryKey): AlterTableAddPrimaryKeySql {
  return {
    alterTable: table(step.table, step.schema),
    add: {
      primaryKey: step.fieldNames,
    },
  };
}
