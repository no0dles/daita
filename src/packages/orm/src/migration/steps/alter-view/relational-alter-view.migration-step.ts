import { SelectSql } from '@daita/relational';

export interface RelationalAlterViewMigrationStep {
  kind: 'alter_view';
  schema?: string;
  view: string;
  query: SelectSql<any>;
}
