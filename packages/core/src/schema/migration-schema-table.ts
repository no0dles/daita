import {DatabaseSchemaTable} from './database-schema-table';
import {MigrationSchemaTableField} from './migration-schema-table-field';
import {RelationalTableSchemaTable} from './relational-table-schema-table';
import {MigrationDescription} from '../migration';

export class MigrationSchemaTable extends DatabaseSchemaTable<MigrationSchemaTableField>
  implements RelationalTableSchemaTable {

  private sourceFieldMap: { [key: string]: MigrationSchemaTableField } = {};

  constructor(name: string, public sourceMigration: MigrationDescription, fields: MigrationSchemaTableField[] = []) {
    super(name, {}, [], []);
    for (const field of fields) {
      this.add(field);
    }
  }

  sourceField(name: string): MigrationSchemaTableField | null {
    return this.sourceFieldMap[name] || null;
  }

  add(field: MigrationSchemaTableField) {
    this.fieldMap[field.name] = field;
    this.sourceFieldMap[`${field.sourceMigration.id}_${field.sourceFieldName}`] = field;
  }

  rename(oldFieldName: string, newFieldName: string) {
    this.fieldMap[newFieldName] = this.fieldMap[oldFieldName];
    delete this.fieldMap[oldFieldName];
  }

  drop(fieldName: string) {
    delete this.fieldMap[fieldName];
  }
}
