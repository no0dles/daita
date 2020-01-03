import { DatabaseSchemaCollection } from './database-schema-collection';
import { DocumentCollectionSchemaCollection } from './document-collection-schema-collection';
import { MigrationSchemaCollectionField } from './migration-schema-collection-field';
import { MigrationDescription } from '../migration';

export class MigrationSchemaCollection
  extends DatabaseSchemaCollection<MigrationSchemaCollectionField>
  implements DocumentCollectionSchemaCollection {
  constructor(name: string, public sourceMigration: MigrationDescription) {
    super(name, {});
  }

  add(field: MigrationSchemaCollectionField) {
    this.fieldMap[field.name] = field;
  }

  rename(oldFieldName: string, newFieldName: string) {
    this.fieldMap[newFieldName] = this.fieldMap[oldFieldName];
    delete this.fieldMap[oldFieldName];
  }

  drop(fieldName: string) {
    delete this.fieldMap[fieldName];
  }
}
