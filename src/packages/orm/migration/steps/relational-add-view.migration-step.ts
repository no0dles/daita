import { SelectSql } from '../../../relational/sql/select-sql';

export interface RelationalAddViewMigrationStep {
  kind: 'add_view';
  schema?: string;
  view: string;
  query: SelectSql<any>;
}
