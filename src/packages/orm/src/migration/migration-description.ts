import { MigrationStep } from './migration-step';
import { getTableDescriptionIdentifier } from '../schema/description/relational-schema-description';
import { table } from '@daita/relational';
import { TableDescription } from '@daita/relational/sql/keyword/table/table-description';

export interface MigrationDescription {
  id: string;
  steps: MigrationStep[];
  resolve?: string;
  after?: string;
}

export function hasAddTableStep(migration: MigrationDescription, tbl: TableDescription<any>) {
  return migration.steps.some(
    (s) =>
      s.kind === 'add_table' &&
      getTableDescriptionIdentifier(table(s.table, s.schema)) == getTableDescriptionIdentifier(tbl),
  );
}
