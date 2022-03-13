import { MigrationStep } from './migration-step';
import { getTableDescriptionIdentifier } from '../schema/description/relational-schema-description';
import { table } from '@daita/relational';

export interface MigrationDescription {
  id: string;
  steps: MigrationStep[];
  resolve?: string;
  after?: string;
}

export function hasAddTableStep(migration: MigrationDescription, step: { table: string; schema?: string | undefined }) {
  return migration.steps.some(
    (s) =>
      s.kind === 'add_table' &&
      getTableDescriptionIdentifier(table(s.table, s.schema)) ==
        getTableDescriptionIdentifier(table(step.table, step.schema)),
  );
}
