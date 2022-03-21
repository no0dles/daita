import { failNever } from '@daita/common';
import { SchemaTableDescription, SchemaTableFieldDescription } from './relational-schema-description';

export function validateValueForTableField(key: string, field: SchemaTableFieldDescription, value: any) {
  if (field.required && (value === null || value === undefined)) {
    throw new Error(`${key} is required`);
  }

  if (value === null || value === undefined) {
    return;
  }

  if (field.type === 'unknown') {
    return;
  }

  if (field.type === 'string') {
    if (typeof value !== 'string') {
      throw new Error(`${key} is not a string`);
    }
  } else if (field.type === 'uuid') {
  } else if (field.type === 'boolean') {
    if (typeof value !== 'boolean') {
      throw new Error(`${key} is not a boolean`);
    }
  } else if (field.type === 'json') {
    if (typeof value !== 'object') {
      throw new Error(`${key} is not an object`);
    }
  } else if (field.type === 'number') {
    if (typeof value !== 'number') {
      throw new Error(`${key} is not a number`);
    }
  } else if (field.type === 'date') {
    if (!(value instanceof Date)) {
      throw new Error(`${key} is not a Date`);
    }
  } else if (
    field.type === 'boolean[]' ||
    field.type === 'number[]' ||
    field.type === 'date[]' ||
    field.type === 'string[]'
  ) {
    if (!(value instanceof Array)) {
      throw new Error(`${key} is not an array`);
    }

    for (const item of value) {
      if (field.type === 'string[]') {
        if (typeof value !== 'string') {
          throw new Error(`${key} is not a string`);
        }
      } else if (field.type === 'date[]') {
        if (!(value instanceof Date)) {
          throw new Error(`${key} is not a date`);
        }
      } else if (field.type === 'number[]') {
        if (typeof value !== 'number') {
          throw new Error(`${key} is not a number`);
        }
      } else if (field.type === 'boolean[]') {
        if (typeof value !== 'boolean') {
          throw new Error(`${key} is not a boolean`);
        }
      } else {
        failNever(field.type, 'unknown type');
      }
    }
  } else {
    failNever(field.type, 'unknown type');
  }
}

export function isFieldPrimaryKey(table: SchemaTableDescription, fieldKey: string) {
  if (!table.primaryKeys) {
    return false;
  }
  return table.primaryKeys.indexOf(fieldKey) >= 0;
}
