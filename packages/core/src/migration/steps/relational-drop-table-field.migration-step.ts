import {BaseMigrationStep} from './base-migration-step';

export class RelationalDropTableFieldMigrationStep implements BaseMigrationStep {
  kind = 'drop_table_field';

  constructor(public table: string, public fieldName: string) {
  }
}
