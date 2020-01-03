import { BaseMigrationStep } from './base-migration-step';

export class RelationalDropTableMigrationStep implements BaseMigrationStep {
  kind = 'drop_table';

  constructor(public table: string) {}
}
