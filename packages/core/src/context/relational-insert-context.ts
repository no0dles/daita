import {MigrationSchema} from '../schema/migration-schema';
import {ExcludeNonPrimitive} from './types/exclude-non-primitive';
import {MigrationSchemaTable} from '../schema/migration-schema-table';
import {DefaultConstructable} from '../constructable';
import {RelationalSchemaBaseContext} from './relational-schema-base-context';
import {RelationalInsertBuilder} from '../builder/relational-insert-builder';
import {SqlInsertResult} from '../sql/insert';

export class RelationalInsertContext<T> extends RelationalSchemaBaseContext<SqlInsertResult> {
  private table: MigrationSchemaTable;

  constructor(
    private schema: MigrationSchema,
    private type: DefaultConstructable<T>,
    private builder: RelationalInsertBuilder<T>,
  ) {
    super(builder);

    const table = this.schema.table(this.type.name);
    if (!table) {
      throw new Error(`Could not find table ${this.type.name} in schema`);
    }
    this.table = table;
  }

  private validateObject(item: any) {
    const objectKeys = Object.keys(item);
    const object: any = {};

    for (const field of this.table.fields) {
      const index = objectKeys.indexOf(field.name);
      if (index >= 0) {
        objectKeys.splice(index, 1);
        const value = item[field.name];
        if (
          field.defaultValue !== undefined &&
          (value === undefined || value === null)
        ) {
          object[field.name] = field.defaultValue;
        } else {
          object[field.name] = value;
        }
      } else if (field.defaultValue !== undefined) {
        object[field.name] = field.defaultValue;
      }

      if (
        field.required &&
        (object[field.name] === null || object[field.name] === undefined)
      ) {
        throw new Error(`${field.name} is required`);
      }

      if (object[field.name] === null || object[field.name] === undefined) {
        continue;
      }

      if (field.type === 'string' && typeof object[field.name] !== 'string') {
        throw new Error(`${field.name} is not a string`);
      }

      if (field.type === 'boolean' && typeof object[field.name] !== 'boolean') {
        throw new Error(`${field.name} is not a boolean`);
      }

      if (field.type === 'number' && typeof object[field.name] !== 'number') {
        throw new Error(`${field.name} is not a number`);
      }

      if (field.type === 'date' && !(object[field.name] instanceof Date)) {
        throw new Error(`${field.name} is not a Date`);
      }
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
}
