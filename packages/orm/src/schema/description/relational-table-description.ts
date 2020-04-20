import { RelationalTableFieldDescription } from "./relational-table-field-description";
import { ArrayMap } from "./array-map";
import { RelationalTableReferenceDescription } from "./relational-table-reference-description";
import { arrayClone, removeEmptySchema, SqlDelete, SqlInsert, SqlSelect, SqlUpdate } from "@daita/core";

export class RelationalTableDescription {
  private primaryKeysArray: string[] = [];
  private fieldArrayMap: ArrayMap<RelationalTableFieldDescription>;
  private referenceArrayMap: ArrayMap<RelationalTableReferenceDescription>;

  constructor(public key: string,
              public name: string,
              public schema?: string) {
    this.fieldArrayMap = new ArrayMap<RelationalTableFieldDescription>();
    this.referenceArrayMap = new ArrayMap<RelationalTableReferenceDescription>();
  }

  get fields() {
    return arrayClone(this.fieldArrayMap.array);
  }

  get primaryKeys() {
    return arrayClone(this.primaryKeysArray);
  }

  get references() {
    return arrayClone(this.referenceArrayMap.array);
  }

  addPrimaryKey(keys: string[]) {
    this.primaryKeysArray.push(...keys);
    for (const key of keys) {
      this.field(key).setPrimaryKey();
    }
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
