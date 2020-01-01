import {RelationalTableSchemaTable} from './relational-table-schema-table';
import {RelationalTableSchemaTableField} from './relational-table-schema-table-field';
import {RelationalTableSchemaTableReferenceKey} from "./relational-table-schema-table-reference-key";

export class DatabaseSchemaTable<
  TField extends RelationalTableSchemaTableField = RelationalTableSchemaTableField,
  TReferenceField extends RelationalTableSchemaTableReferenceKey = RelationalTableSchemaTableReferenceKey,
  >  implements RelationalTableSchemaTable {
  constructor(public name: string,
              protected fieldMap: {[key: string]: TField },
              public primaryKeys: string[],
              public foreignKeys: TReferenceField[]) {
  }

  get fieldNames() {
    return Object.keys(this.fieldMap);
  }

  field(name: string): TField {
    return this.fieldMap[name] || null;
  }

  get fields(): TField[] {
    return this.fieldNames.map(name => this.fieldMap[name]);
  }
}
