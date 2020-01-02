import {BaseMigrationStep} from './base-migration-step';

export class RelationalAddTableForeignKey implements BaseMigrationStep {
  kind = "add_table_foreign_key";

  constructor(
    public table: string,
    public name: string,
    public fieldNames: string[],
    public foreignTable: string,
    public foreignFieldNames: string[]
  ) {}
}
