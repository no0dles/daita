import {RelationalTableSchemaTableFieldType} from '../relational-table-schema-table-field-type';


export class RelationalTableFieldDescription {
  constructor(public key: string,
              public name: string,
              public type: RelationalTableSchemaTableFieldType,
              public required: boolean,
              public defaultValue: any) {
  }

  validateValue(value: any): void {
    if (
      this.required &&
      (value === null || value === undefined)
    ) {
      throw new Error(`${this.name} is required`);
    }

    if (value === null || value === undefined) {
      return;
    }

    if (this.type === 'string' && typeof value !== 'string') {
      throw new Error(`${this.name} is not a string`);
    }

    if (this.type === 'boolean' && typeof value !== 'boolean') {
      throw new Error(`${this.name} is not a boolean`);
    }

    if (this.type === 'number' && typeof value !== 'number') {
      throw new Error(`${this.name} is not a number`);
    }

    if (this.type === 'date' && !(value instanceof Date)) {
      throw new Error(`${this.name} is not a Date`);
    }

    fail('should not exist');
  }
}
