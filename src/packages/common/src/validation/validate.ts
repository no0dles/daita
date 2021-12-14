import { ValidationError } from './type-validation-error';
import { Type } from './type';
import { failNever } from '../utils/fail-never';

export const ValidateStringErrorMessage = 'not a valid string';
export const ValidateNumberErrorMessage = 'not a valid number';
export const ValidateNumberEnumErrorMessage = 'not a valid number value';
export const ValidateBooleanErrorMessage = 'not a valid boolean';
export const ValidateBooleanEnumErrorMessage = 'not a valid boolean value';
export const ValidateDateErrorMessage = 'not a valid date';
export const ValidateArrayErrorMessage = 'not a valid array';
export const ValidateStringEnumErrorMessage = 'not a valid string value';
export const ValidateNullErrorMessage = 'is not null';
export const ValidateMapErrorMessage = 'is not a map';
export const ValidateObjectErrorMessage = 'is not an object';
export const ValidateObjectUnknownPropErrorMessage = 'unexpected object prop';
export const ValidateObjectMissingPropErrorMessage = 'missing object prop';
export const ValidateUndefinedErrorMessage = 'is not undefined';
export const ValidateUnknownTypeErrorMessage = 'unknown type';
export const ValidateUnionErrorMessage = 'is not a valid union type';

export function* validate(type: Type, value: any, path: string[] = []): Generator<ValidationError> {
  try {
    if (type.type === 'string') {
      if (typeof value === 'string') {
        if (type.enum && type.enum.indexOf(value) === -1) {
          yield { message: ValidateStringEnumErrorMessage, path };
        }
        return;
      } else {
        yield { message: ValidateStringErrorMessage, path };
      }
    } else if (type.type === 'boolean') {
      if (typeof value === 'boolean') {
        if (type.enum && type.enum.indexOf(value) === -1) {
          yield { message: ValidateBooleanEnumErrorMessage, path };
        }
        return;
      } else {
        yield { message: ValidateBooleanErrorMessage, path };
      }
    } else if (type.type === 'number') {
      if (typeof value === 'number') {
        if (type.enum && type.enum.indexOf(value) === -1) {
          yield { message: ValidateNumberEnumErrorMessage, path };
        }
        return;
      } else {
        yield { message: ValidateNumberErrorMessage, path };
      }
    } else if (type.type === 'date') {
      if (value instanceof Date) {
        return;
      } else {
        yield { message: ValidateDateErrorMessage, path };
      }
    } else if (type.type === 'array') {
      if (value instanceof Array) {
        for (let i = 0; i < value.length; i++) {
          for (const error of validate(type.itemType, value[i], [...path, i.toString()])) {
            yield error;
          }
        }
      } else {
        yield { message: ValidateArrayErrorMessage, path };
      }
    } else if (type.type === 'null') {
      if (value === null) {
        return;
      } else {
        yield { message: ValidateNullErrorMessage, path };
      }
    } else if (type.type === 'undefined') {
      if (value === undefined) {
        return;
      } else {
        yield { message: ValidateUndefinedErrorMessage, path };
      }
    } else if (type.type === 'object') {
      if (
        typeof value === 'object' &&
        value !== null &&
        value !== undefined &&
        !(value instanceof Date) &&
        !(value instanceof Array) &&
        !(value instanceof RegExp) &&
        !(value instanceof Map)
      ) {
        const keys = Object.keys(type.props);
        const valueKeys = Object.keys(value);
        for (const key of keys) {
          const prop = type.props[key];
          const valueKeyIndex = valueKeys.indexOf(key);
          if (valueKeyIndex >= 0) {
            const propValue = value[key];
            const isEmpty = propValue === null || propValue === undefined;
            if (prop.required || !isEmpty) {
              for (const error of validate(prop.type, propValue, [...path, key])) {
                yield error;
              }
            }
            valueKeys.splice(valueKeyIndex, 1);
          } else if (prop.required) {
            yield {
              message: ValidateObjectMissingPropErrorMessage,
              path: [...path, key],
            };
          } else {
            valueKeys.splice(valueKeyIndex, 1);
          }
        }

        for (const valueKey of valueKeys) {
          yield {
            message: ValidateObjectUnknownPropErrorMessage,
            path: [...path, valueKey],
          };
        }
      } else {
        yield { message: ValidateObjectErrorMessage, path };
      }
    } else if (type.type === 'map') {
      if (
        typeof value === 'object' &&
        value !== null &&
        value !== undefined &&
        !(value instanceof Date) &&
        !(value instanceof Array) &&
        !(value instanceof RegExp)
      ) {
        const valueKeys = Object.keys(value);
        for (const key of valueKeys) {
          for (const error of validate(type.itemType, value[key], [...path, key])) {
            yield error;
          }
        }
      } else {
        yield { message: 'is not a map', path };
      }
    } else if (type.type === 'union') {
      for (const unionType of type.unionTypes) {
        const errors = Array.from(validate(unionType, value, path));
        if (errors.length === 0) {
          return;
        }
      }
      yield { message: ValidateUnionErrorMessage, path };
    } else if (type.type === 'any') {
      return;
    } else {
      failNever(type, ValidateUnknownTypeErrorMessage);
    }
  } catch (e) {
    yield { message: e.message, path };
  }
}
