import { RelationalTableFieldDescription } from "./relational-table-field-description";
import { ArrayMap } from "./array-map";
import { RelationalTableReferenceDescription } from "./relational-table-reference-description";
import { removeEmptySchema, SqlDelete, SqlInsert, SqlSelect, SqlUpdate } from "@daita/relational";
import { arrayClone } from "@daita/common";
import {RelationalSchemaDescription} from './relational-schema-description';

export class RelationalTableDescription {
  private primaryKeysArray: ArrayMap<RelationalTableFieldDescription>;
  private fieldArrayMap: ArrayMap<RelationalTableFieldDescription>;
  private referenceArrayMap: ArrayMap<RelationalTableReferenceDescription>;

  constructor(private schemaDescription: RelationalSchemaDescription,
              public key: string,
              public name: string,
              public schema?: string) {
    this.fieldArrayMap = new ArrayMap<RelationalTableFieldDescription>();
    this.referenceArrayMap = new ArrayMap<RelationalTableReferenceDescription>();
    this.primaryKeysArray = new ArrayMap<RelationalTableFieldDescription>();
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

  addPrimaryKey(field: RelationalTableFieldDescription) {
    this.primaryKeysArray.add(field.key, field);
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

  containsField(name: string): boolean {
    return this.fieldArrayMap.exists(name);
  }

  reference(alias: string): RelationalTableReferenceDescription {
    const reference = this.referenceArrayMap.get(alias);
    if (!reference) {
      throw new Error(`Unable to get reference ${alias} from table ${this.name}`);
    }
    return reference;
  }

  permissions<T>() {
    return this.schemaDescription.schemaPermissions.tablePermissions({table: this.name, schema: this.schema});
  }

  getSqlSelect(): SqlSelect {
    return {
      select: [],
      from: removeEmptySchema({ schema: this.schema, table: this.name, alias: "base" })
    };
  }

  getSqlDelete(): SqlDelete {
    return {
      delete: removeEmptySchema({ schema: this.schema, table: this.name })
    };
  }

  getSqlUpdate(): SqlUpdate {
    return {
      update: removeEmptySchema({ schema: this.schema, table: this.name }),
      set: {}
    };
  }

  getSqlInsert(): SqlInsert {
    return {
      insert: removeEmptySchema({ schema: this.schema, table: this.name }),
      values: []
    };
  }
}
