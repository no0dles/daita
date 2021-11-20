import { SelectSql } from '@daita/relational';

export interface RelationalAddViewMigrationStep {
  kind: 'add_view';
  schema?: string;
  view: string;
  query: SelectSql<any>;
}
