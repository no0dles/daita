import { DocumentCollectionSchemaCollectionField } from './document-collection-schema-collection-field';
import { DocumentCollectionSchemaCollectionFieldType } from './document-collection-schema-collection-field-type';
import { MigrationDescription } from '../migration';

export class MigrationSchemaCollectionField
  implements DocumentCollectionSchemaCollectionField {
  constructor(
    public name: string,
    public type: DocumentCollectionSchemaCollectionFieldType,
    public required: boolean,
    public defaultValue: any,
    public sourceMigration: MigrationDescription,
    public sourceFieldName: string,
  ) {}

  get baseFieldName() {
    return `${this.sourceMigration.id}_${this.sourceFieldName}`;
  }
}
