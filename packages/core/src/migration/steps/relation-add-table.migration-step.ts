import {BaseMigrationStep} from './base-migration-step';

export class RelationalAddTableMigrationStep implements BaseMigrationStep {
  kind = "add_table";

  constructor(public table: string) {}
}
