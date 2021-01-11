import { Type } from './type';
import { ValidationError } from './type-validation-error';
import { ArrayType } from './array-type';
import { ObjectType } from './object-type';
import { MapType } from './map-type';
import { UnionType } from './union-type';
import { failNever } from '../utils/fail-never';

export function isBackwardCompatible(oldType: Type, newType: Type, path: string[] = []) {
  for (const error of getBackwardCompatibleErrors(oldType, newType, path)) {
    return false;
  }
  return true;
}

export function* getBackwardCompatibleErrors(
  oldType: Type,
  newType: Type,
  path: string[] = [],
): Generator<ValidationError> {
  if (oldType.type === newType.type) {
    if (
      oldType.type === 'boolean' ||
      oldType.type === 'date' ||
      oldType.type === 'string' ||
      oldType.type === 'number' ||
      oldType.type === 'null' ||
      oldType.type === 'undefined'
    ) {
      return;
    }

    if (oldType.type === 'array') {
      for (const error of getBackwardCompatibleErrors(oldType.itemType, (newType as ArrayType).itemType, path)) {
        yield error;
      }
      return;
    }

    if (oldType.type === 'object') {
      const newObjectType = newType as ObjectType;
      const oldKeys = Object.keys(oldType.props);
      const newKeys = Object.keys(newObjectType.props);
      for (const oldKey of oldKeys) {
        const oldProp = oldType.props[oldKey];
        const newProp = newObjectType.props[oldKey];
        if (!newProp) {
          yield { message: 'missing old property', path: [...path, oldKey] };
        }
        newKeys.splice(newKeys.indexOf(oldKey), 1);
        if (newProp.required && !oldProp.required && newProp.defaultValue === undefined) {
          // TODO check default value
          yield {
            message: 'existing optional property cant be required without default value',
            path: [...path, oldKey],
          };
        }
        for (const error of getBackwardCompatibleErrors(oldProp.type, newProp.type, [...path, oldKey])) {
          yield error;
        }
      }

      for (const newKey of newKeys) {
        const newProp = newObjectType.props[newKey];
        if (newProp.required && newProp.defaultValue === undefined) {
          yield {
            message: 'new property cant be required without default value',
            path: [...path, newKey],
          };
        }
      }
      return;
    }

    if (oldType.type === 'map') {
      return getBackwardCompatibleErrors(oldType.itemType, (newType as MapType).itemType, path);
    }

    if (oldType.type === 'any') {
      return;
    }

    if (oldType.type === 'union') {
      const newUnionType = newType as UnionType;
      for (const oldUnionType of oldType.unionTypes) {
        if (
          !newUnionType.unionTypes.some(
            (ut) => isBackwardCompatible(oldUnionType, ut), // TODO
          )
        ) {
          yield { message: 'old union type missing', path };
        }
      }
      return;
    }

    failNever(oldType, '');
  }

  if (newType.type === 'any') {
    return;
  }

  if (newType.type === 'union') {
    if (newType.unionTypes.some((newUnionType) => isBackwardCompatible(oldType, newUnionType), path)) {
      return;
    }
  }

  if (newType.type === 'map' && oldType.type === 'object') {
    for (const propKey of Object.keys(oldType.props)) {
      const prop = oldType.props[propKey];
      for (const error of getBackwardCompatibleErrors(prop.type, newType.itemType, [...path, propKey])) {
        yield error;
      }
    }
    return;
  }

  yield {
    message: `${oldType.type} is not backward compatible with ${newType.type}`,
    path,
  };
}
