import {RelationalTableFieldDescription} from './relational-table-field-description';
import {ArrayMap} from './array-map';
import {RelationalTableReferenceDescription} from './relational-table-reference-description';

export class RelationalTableDescription {
  private fieldArrayMap: ArrayMap<RelationalTableFieldDescription>;
  private referenceArrayMap: ArrayMap<RelationalTableReferenceDescription>;

  constructor(public name: string,
              public schema?: string) {
    this.fieldArrayMap = new ArrayMap<RelationalTableFieldDescription>();
    this.referenceArrayMap = new ArrayMap<RelationalTableReferenceDescription>();
  }

  get fields() {
    return this.fieldArrayMap.array;
  }

  addField(name: string, field: RelationalTableFieldDescription) {
    this.fieldArrayMap.add(name, field);
  }

  removeField(name: string) {
    this.fieldArrayMap.remove(name);
  }

  addReference(name: string, ref: RelationalTableReferenceDescription) {
    this.referenceArrayMap.add(name, ref);
  }

  removeReference(name: string) {
    this.referenceArrayMap.remove(name);
  }

  field(name: string): RelationalTableFieldDescription {
    const fieldDescription = this.fieldArrayMap.get(name);
    if (!fieldDescription) {
      throw new Error(`Unable to get field ${name} from table ${this.name}`);
    }
    return fieldDescription;
  }

  reference(alias: string): RelationalTableReferenceDescription {
    const reference = this.referenceArrayMap.get(alias);
    if (!reference) {
      throw new Error(`Unable to get reference ${alias} from table ${this.name}`);
    }
    return reference;
  }
}
