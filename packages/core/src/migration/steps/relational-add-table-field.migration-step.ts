import {RelationalTableSchemaTableFieldType} from '../../schema';
import {BaseMigrationStep} from './base-migration-step';

export class RelationalAddTableFieldMigrationStep implements BaseMigrationStep {
  kind = "add_table_field";

  constructor(
    public table: string,
    public fieldName: string,
    public type: RelationalTableSchemaTableFieldType,
    public required: boolean = false,
    public defaultValue: any = null
  ) {}
}
