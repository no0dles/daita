import { RelationalTableFieldDescription } from './relational-table-field-description';
import { ArrayMap } from './array-map';
import { RelationalTableReferenceDescription } from './relational-table-reference-description';
import { arrayClone } from '@daita/common';
import { RelationalSchemaDescription } from './relational-schema-description';
import { RelationalTableIndexDescription } from './relational-table-index-description';
import { Rule } from '@daita/relational';

export class RelationalTableDescription {
  private primaryKeysArray: ArrayMap<RelationalTableFieldDescription>;
  private fieldArrayMap: ArrayMap<RelationalTableFieldDescription>;
  private referenceArrayMap: ArrayMap<RelationalTableReferenceDescription>;
  private indexArrayMap: ArrayMap<RelationalTableIndexDescription>;
  private rules: Rule[] = [];

  constructor(private schemaDescription: RelationalSchemaDescription,
              public key: string,
              public name: string,
              public schema?: string) {
    this.fieldArrayMap = new ArrayMap<RelationalTableFieldDescription>();
    this.referenceArrayMap = new ArrayMap<RelationalTableReferenceDescription>();
    this.primaryKeysArray = new ArrayMap<RelationalTableFieldDescription>();
    this.indexArrayMap = new ArrayMap<RelationalTableIndexDescription>();
  }

  get fields() {
    return arrayClone(this.fieldArrayMap.array);
  }

  get primaryKeys() {
    return arrayClone(this.primaryKeysArray.array);
  }

  get references() {
    return arrayClone(this.referenceArrayMap.array);
  }

  get indices() {
    return arrayClone(this.indexArrayMap.array);
  }

  addIndex(name: string, index: RelationalTableIndexDescription) {
    this.indexArrayMap.add(name, index);
  }

  getRules() {
    return [...this.rules];
  }

  getIndex(name: string) {
    return this.indexArrayMap.get(name);
  }

  dropIndex(name: string) {
    this.indexArrayMap.remove(name);
  }

  addPrimaryKey(field: RelationalTableFieldDescription) {
    this.primaryKeysArray.add(field.key, field);
  }

  addField(name: string, field: RelationalTableFieldDescription) {
    this.fieldArrayMap.add(name, field);
  }

  addRule(rule: Rule) {
    this.rules.push(rule);
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
      throw new Error(`Unable to get field ${name} from table ${this.key}`);
    }
    return fieldDescription;
  }

  containsField(name: string): boolean {
    return this.fieldArrayMap.exists(name);
  }

  reference(alias: string): RelationalTableReferenceDescription {
    const reference = this.referenceArrayMap.get(alias);
    if (!reference) {
      throw new Error(`Unable to get reference ${alias} from table ${this.key}`);
    }
    return reference;
  }
}
