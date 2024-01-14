import { DropViewSql } from '@daita/relational';
import { RelationalDropViewMigrationStep } from './relational-drop-view.migration-step';
import { table } from '@daita/relational';

export function dropViewAction(step: RelationalDropViewMigrationStep): DropViewSql {
  return {
    dropView: table(step.view, step.schema),
  };
}
