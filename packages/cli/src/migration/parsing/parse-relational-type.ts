import { AstType } from '../../ast/ast-type';
import { AstPropertyDeclaration } from '../../ast/ast-property-declaration';
import { AstObjectValue } from '../../ast/ast-object-value';
import { RelationalTableSchemaTableFieldType } from '@daita/orm';

export function parseRelationalType(
  property: AstPropertyDeclaration,
): RelationalTableSchemaTableFieldType {
  if (!property.type) {
    if (property.initializer) {
      if (property.initializer.arrayValue) {
        const types = property.initializer.arrayValue.map(value => getRelationalInitializerType(value));
        const typeSet = new Set(types);
        if (typeSet.size === 1 && types[0]) {
          return types[0];
        }
      } else {
        const type = getRelationalInitializerType(property.initializer);
        if (type) {
          return type;
        }
      }
    }

    throw new Error('unsupported type');
  }

  const primitiveType = getRelationalPrimitiveType(property.type);
  if (primitiveType) {
    return primitiveType;
  } else if (property.type.kind === 'array') {
    if (property.type.elementType.kind === 'string') {
      return 'string[]';
    } else if (property.type.elementType.kind === 'number') {
      return 'number[]';
    } else if (property.type.elementType.kind === 'boolean') {
      return 'boolean[]';
    } else if (property.type.elementType.kind === 'reference') {
      if (property.type.elementType.referenceName === 'Date') {
        return 'date[]';
      }
    }
  } else if (property.type.kind === 'union') {
    const types = property.type.types.filter(t => t.kind !== 'null' && t.kind !== 'undefined');
    if (types.length === 1) {
      const primitiveType = getRelationalPrimitiveType(types[0]);
      if (primitiveType) {
        return primitiveType;
      }
    }
  }

  throw new Error(`unsupported type`);
}

function getRelationalInitializerType(initializer: AstObjectValue): RelationalTableSchemaTableFieldType | null {
  if (initializer.booleanValue !== undefined && initializer.booleanValue !== null) {
    return 'boolean';
  }
  if (initializer.stringValue) {
    return 'string';
  }
  if (initializer.newConstructor?.typeName === 'Date') {
    return 'date';
  }
  return null;
}

function getRelationalPrimitiveType(type: AstType): RelationalTableSchemaTableFieldType | null {
  if (type.kind === 'string') {
    return 'string';
  } else if (type.kind === 'boolean') {
    return 'boolean';
  } else if (type.kind === 'number') {
    return 'number';
  } else if (type.kind === 'reference') {
    if (type.referenceName === 'Date') {
      return 'date';
    }
  }
  return null;
}
