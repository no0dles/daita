import {ExcludeNonPrimitive} from './types/exclude-non-primitive';
import {RelationalSchemaBaseContext} from './relational-schema-base-context';
import {RelationalInsertBuilder} from '../builder/relational-insert-builder';
import {SqlInsertResult} from '../sql/insert';
import {TableInformation} from './table-information';
import {RelationalSchemaDescription} from '../schema/description/relational-schema-description';

export class RelationalInsertContext<T> extends RelationalSchemaBaseContext<RelationalInsertBuilder<T>, SqlInsertResult> {
  constructor(
    schema: RelationalSchemaDescription,
    type: TableInformation<T>,
    builder: RelationalInsertBuilder<T>,
  ) {
    super(builder, type, schema);
  }

  private validateObject(item: any) {
    const objectKeys = Object.keys(item);
    const object: any = {};

    const tableDescription = this.schema.table(this.type);
    for (const fieldDescription of tableDescription.fields) {
      const index = objectKeys.indexOf(fieldDescription.key);
      if (index >= 0) {
        objectKeys.splice(index, 1);
        const value = item[fieldDescription.key];
        if (
          fieldDescription.defaultValue !== undefined &&
          (value === undefined || value === null)
        ) {
          object[fieldDescription.name] = fieldDescription.defaultValue;
        } else {
          object[fieldDescription.name] = value;
        }
      } else if (fieldDescription.defaultValue !== undefined) {
        object[fieldDescription.name] = fieldDescription.defaultValue;
      }

      fieldDescription.validateValue(object[fieldDescription.name]);
    }

    for (const key of objectKeys) {
      //throw new Error(`Could not find field ${key} in table ${this.table.name}`);
      //warning
    }

    return object;
  }

  value(item: ExcludeNonPrimitive<T>): RelationalInsertContext<T> {
    const object = this.validateObject(item);
    const newBuilder = this.builder.value(object);
    return new RelationalInsertContext<T>(this.schema, this.type, newBuilder);
  }

  values(...items: ExcludeNonPrimitive<T>[]): RelationalInsertContext<T> {
    const objects = items.map(item => this.validateObject(item));
    const newBuilder = this.builder.values(...objects);
    return new RelationalInsertContext<T>(this.schema, this.type, newBuilder);
  }

  toSql() {
    return this.builder.toSql();
  }
}
