import { DocumentCollectionSchemaCollectionField } from './document-collection-schema-collection-field';
import { DocumentCollectionSchemaCollectionFieldType } from './document-collection-schema-collection-field-type';

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
    return `${this.sourceFieldName}_${this.sourceMigration.id}`;
  }
}
