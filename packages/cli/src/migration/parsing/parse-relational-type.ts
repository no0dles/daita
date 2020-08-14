import { AstType } from '../../ast/ast-type';
import { RelationalTableSchemaTableFieldType } from '@daita/orm';
import { AstClassDeclarationProp } from '../../ast/ast-class-declaration-prop';
import { AstUnionType } from '../../ast/ast-union-type';
import { AstKeywordType } from '../../ast/ast-keyword-type';
import { AstValue } from '../../ast/ast-value';
import { AstArrayType } from '../../ast/ast-array-type';
import { AstLiteralType } from '../../ast/ast-literal-type';
import { AstEnumDeclaration } from '../../ast/ast-enum-declaration';
import { AstTypeLiteralType } from '../../ast/ast-type-literal-type';
import { AstReferenceType } from '../../ast/ast-reference-type';
import { AstLiteralValue } from '../../ast/ast-literal-value';
import { AstKeywordValue } from '../../ast/ast-keyword-value';
import { AstPropertyAccessExpression } from '../../ast/ast-property-access-expression';

export function parseRelationalType(type: AstType): RelationalTableSchemaTableFieldType {
  if (type instanceof AstArrayType) {
    if (!type.elementType) {
      throw new Error('array requires type');
    }
    const elementFieldType = parseRelationalType(type.elementType);
    const arrayType = parseRelationalType(type);

  } else if (type instanceof AstLiteralType) {
    if (type.isNumber) {
      return 'number';
    } else if (type.isString) {
      return 'string';
    } else {
      throw new Error('unknown literal type');
    }
  } else if (type instanceof AstTypeLiteralType) {
    return 'json';
  } else if (type instanceof AstReferenceType) {
    if (type.name === 'Date') {
      return 'date';
    } else if (type.referenceType instanceof AstEnumDeclaration) {
      return parseRelationalType(type.referenceType.type);
    } else if (type.name === 'UUID') {
      return 'uuid';
    }
  } else if (type instanceof AstUnionType) {
    const relationalTypes: RelationalTableSchemaTableFieldType[] = [];

    for (const unionType of type.types) {
      if (unionType instanceof AstKeywordType && (unionType.isNull || unionType.isUndefined)) {
        continue;
      }

      const relationalType = parseRelationalType(unionType);
      if (relationalTypes.indexOf(relationalType) === -1) {
        relationalTypes.push(relationalType);
      }
    }
    if (relationalTypes.length === 1) {
      return relationalTypes[0];
    }
  } else if (type instanceof AstKeywordType) {
    if (type.isBoolean) {
      return 'boolean';
    } else if (type.isString) {
      return 'string';
    } else if (type.isNumber) {
      return 'number';
    } else {
      throw new Error('unknown keyword type');
    }
  }

  throw new Error(`unsupported type`);
}

export function isRequiredProperty(property: AstClassDeclarationProp) {
  if (property.canBeUndefined) {
    return false;
  }

  const propertyType = property.type;
  if (propertyType instanceof AstUnionType) {
    for (const subType of propertyType.types) {
      if (subType instanceof AstKeywordType) {
        if (subType.isNull || subType.isUndefined) {
          return false;
        }
      }
    }
  }

  return true;
}

export function getRawValue(value: AstValue | null): any {
  if (!value) {
    return undefined;
  }

  if (value instanceof AstLiteralValue) {
    return value.value;
  }

  if (value instanceof AstKeywordValue) {
    return value.value;
  }

  if (value instanceof AstPropertyAccessExpression) {
    return getRawValue(value.value);
  }

  console.log(`unknown value`, value);
  return undefined;
}
