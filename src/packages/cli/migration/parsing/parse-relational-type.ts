import { AstType } from '../../ast/ast-type';
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
import { AstError } from '../../ast/utils';
import { SchemaTableFieldTypeDescription } from '../../../orm/schema/schema-table-field-type-description';
import { AstTypeDeclaration } from '../../ast/ast-type-declaration';

export function parseRelationalType(type: AstType): SchemaTableFieldTypeDescription {
  if (type instanceof AstArrayType) {
    if (!type.elementType) {
      throw new Error('array requires type');
    }
    const elementFieldType = parseRelationalType(type.elementType);
    switch (elementFieldType) {
      case 'string':
        return 'string[]';
      case 'boolean':
        return 'boolean[]';
      case 'number':
        return 'number[]';
      default:
        throw new AstError(type.node, `does not support array type`);
    }
  } else if (type instanceof AstLiteralType) {
    if (type.isNumber) {
      return 'number';
    } else if (type.isString) {
      return 'string';
    } else if (type.isNull) {
      throw new AstError(type.node, 'unexpected null type');
    } else {
      throw new AstError(type.node, 'unknown literal type');
    }
  } else if (type instanceof AstTypeLiteralType) {
    return 'json';
  } else if (type instanceof AstReferenceType) {
    if (type.name === 'Date') {
      return 'date';
    } else if (type.name === 'UUID') {
      return 'uuid';
    } else if (type.name === 'Json') {
      return 'json';
    }
    const refType = type.referenceType;

    if (refType instanceof AstEnumDeclaration) {
      return parseRelationalType(refType.type);
    } else if (refType instanceof AstTypeDeclaration) {
      if (!refType.type) {
        throw new AstError(refType.node, 'missing type');
      }
      return parseRelationalType(refType.type);
    }
  } else if (type instanceof AstUnionType) {
    const relationalTypes: SchemaTableFieldTypeDescription[] = [];

    for (const unionType of type.types) {
      if (
        (unionType instanceof AstKeywordType && (unionType.isNull || unionType.isUndefined)) ||
        (unionType instanceof AstLiteralType && unionType.isNull)
      ) {
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
      throw new AstError(type.node, 'unknown keyword type');
    }
  }

  throw new AstError(type.node, `unsupported type`);
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
      } else if (subType instanceof AstLiteralType) {
        if (subType.isNull) {
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

  return undefined;
}
