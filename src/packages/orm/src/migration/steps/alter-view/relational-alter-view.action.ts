import { RelationalAlterViewMigrationStep } from './relational-alter-view.migration-step';
import { CreateViewSql, table } from '@daita/relational';

export function alterViewAction(step: RelationalAlterViewMigrationStep): CreateViewSql<any> {
  return {
    createView: table(step.view, step.schema),
    orReplace: true,
    as: step.query,
  };
}
