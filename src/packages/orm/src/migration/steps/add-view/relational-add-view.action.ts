import { CreateViewSql } from '@daita/relational';
import { RelationalAddViewMigrationStep } from './relational-add-view.migration-step';
import { table } from '@daita/relational';

export function addViewAction(step: RelationalAddViewMigrationStep): CreateViewSql<any> {
  return {
    createView: table(step.view, step.schema),
    as: step.query,
  };
}
