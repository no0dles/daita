import { table } from '@daita/relational';
import {
  RelationalUpdateTableFieldRequiredMigrationStep
} from '@daita/orm';
import { PostgresAlterTableSql } from '../../sql/alter-table-sql';

export function updateTableFieldRequiredAction(
  step: RelationalUpdateTableFieldRequiredMigrationStep,
): PostgresAlterTableSql {
  if (step.required) {
    return {
      alterTable: table(step.table, step.schema),
      alterColumn: {
        set: 'not null',
      },
    };
  } else {
    return {
      alterTable: table(step.table, step.schema),
      alterColumn: {
        drop: 'not null',
      },
    };
  }
}
