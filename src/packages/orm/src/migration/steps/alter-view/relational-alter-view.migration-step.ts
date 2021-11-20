import { SelectSql } from '@daita/relational/sql/dml/select/select-sql';

export interface RelationalAlterViewMigrationStep {
  kind: 'alter_view';
  schema?: string;
  view: string;
  query: SelectSql<any>;
}
