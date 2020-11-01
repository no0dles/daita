import { SelectSql } from '../../../relational/sql/select-sql';

export interface RelationalAlterViewMigrationStep {
  kind: 'alter_view';
  schema?: string;
  view: string;
  query: SelectSql<any>;
}
