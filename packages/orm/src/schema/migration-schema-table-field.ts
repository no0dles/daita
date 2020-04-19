import { RelationalTableSchemaTableField } from './relational-table-schema-table-field';
import { RelationalTableSchemaTableFieldType } from './relational-table-schema-table-field-type';
import { MigrationDescription } from '../migration';

export class MigrationSchemaTableField
  implements RelationalTableSchemaTableField {
  constructor(
    public name: string,
    public type: RelationalTableSchemaTableFieldType,
    public required: boolean,
    public defaultValue: any,
    public sourceMigration: MigrationDescription,
    public sourceFieldName: string,
  ) {}

  get baseFieldName() {
    return `${this.sourceFieldName}_${this.sourceMigration.id}`;
  }
}
