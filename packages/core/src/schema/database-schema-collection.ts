import { DocumentCollectionSchemaCollection } from './document-collection-schema-collection';
import { DocumentCollectionSchemaCollectionField } from './document-collection-schema-collection-field';

export class DatabaseSchemaCollection<
  TField extends DocumentCollectionSchemaCollectionField = DocumentCollectionSchemaCollectionField
> implements DocumentCollectionSchemaCollection {
  constructor(
    public name: string,
    protected fieldMap: { [key: string]: TField },
  ) {}

  get fieldNames() {
    return Object.keys(this.fieldMap);
  }

  field(name: string): TField {
    return this.fieldMap[name] || null;
  }

  get fields() {
    return this.fieldNames.map(field => this.fieldMap[field]);
  }

  add(field: TField) {
    this.fieldMap[field.name] = field;
  }

  remove(fieldName: string) {
    delete this.fieldMap[fieldName];
  }
}
