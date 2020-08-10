import { RelationalTableSchemaTableFieldType } from '../relational-table-schema-table-field-type';
import { failNever } from '@daita/common';
import { RelationalTableDescription } from './relational-table-description';


export class RelationalTableFieldDescription {
  constructor(private tableDescription: RelationalTableDescription,
              public key: string,
              public name: string,
              public type: RelationalTableSchemaTableFieldType,
              public required: boolean,
              public defaultValue: any) {
  }

  get isPrimaryKey() {
    return this.tableDescription.primaryKeys.indexOf(this) >= 0;
  }

  validateValue(value: any): void {
    if (
      this.required &&
      (value === null || value === undefined)
    ) {
      throw new Error(`${this.key} is required`);
    }

    if (value === null || value === undefined) {
      return;
    }

    if (this.type === 'string') {
      if (typeof value !== 'string') {
        throw new Error(`${this.key} is not a string`);
      }
    } else if (this.type === 'boolean') {
      if (typeof value !== 'boolean') {
        throw new Error(`${this.key} is not a boolean`);
      }
    } else if (this.type === 'json') {
      if (typeof value !== 'object') {
        throw new Error(`${this.key} is not an object`);
      }
    } else if (this.type === 'number') {
      if (typeof value !== 'number') {
        throw new Error(`${this.key} is not a number`);
      }
    } else if (this.type === 'date') {
      if (!(value instanceof Date)) {
        throw new Error(`${this.key} is not a Date`);
      }
    } else if (this.type === 'boolean[]' || this.type === 'number[]' || this.type === 'date[]' || this.type === 'string[]') {
      if (!(value instanceof Array)) {
        throw new Error(`${this.key} is not an array`);
      }

      for (const item of value) {
        if (this.type === 'string[]') {
          if (typeof value !== 'string') {
            throw new Error(`${this.key} is not a string`);
          }
        } else if (this.type === 'date[]') {
          if (!(value instanceof Date)) {
            throw new Error(`${this.key} is not a date`);
          }
        } else if (this.type === 'number[]') {
          if (typeof value !== 'number') {
            throw new Error(`${this.key} is not a number`);
          }
        } else if (this.type === 'boolean[]') {
          if (typeof value !== 'boolean') {
            throw new Error(`${this.key} is not a boolean`);
          }
        } else {
          failNever(this.type, 'unknown type');
        }
      }
    } else {
      failNever(this.type, 'unknown type');
    }
  }
}
