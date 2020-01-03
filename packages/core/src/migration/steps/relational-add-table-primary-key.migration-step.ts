import { BaseMigrationStep } from './base-migration-step';

export class RelationalAddTablePrimaryKey implements BaseMigrationStep {
  kind = 'add_table_primary_key';

  constructor(public table: string, public fieldNames: string[]) {}
}
