import { MigrationStep } from './migration-step';
import { getTableDescriptionIdentifier } from '../schema/description/relational-schema-description';
import { RelationalTransactionAdapter, table } from '@daita/relational';
import { OrmSql } from './sql';

export interface MigrationDescription {
  id: string;
  steps: MigrationStep[];
  resolve?: string;
  after?: string;
  up?: (client: RelationalTransactionAdapter<OrmSql>) => void;
  down?: (client: RelationalTransactionAdapter<OrmSql>) => void;
}

export function hasAddTableStep(migration: MigrationDescription, step: { table: string; schema?: string | undefined }) {
  return migration.steps?.some(
    (s) =>
      s.kind === 'add_table' &&
      getTableDescriptionIdentifier(table(s.table, s.schema)) ==
        getTableDescriptionIdentifier(table(step.table, step.schema)),
  );
}
