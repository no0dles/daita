import { parseRelationalType } from './parse-relational-type';
import { AstPropertyDeclaration } from '../../ast/ast-property-declaration';
import { RelationalTableDescription } from '@daita/orm';
import { RelationalTableFieldDescription } from '@daita/orm';
import { AstClassDeclaration } from '../../ast/ast-class-declaration';

export function parseRelationalSchemaTableFields(table: RelationalTableDescription, classDeclaration: AstClassDeclaration) {
  for (const property of classDeclaration.getProperties({ includedInherited: true })) {
    if (!property.name) {
      throw new Error('missing prop name');
    }

    if (!property.type || property.type.kind !== 'reference' || property.type.referenceName === 'Date') {
      try {
        table.addField(property.name, new RelationalTableFieldDescription(table,
          property.name, property.name,
          parseRelationalType(property),
          isRequiredProperty(property),
          property?.initializer?.anyValue));
      } catch (e) {
        throw new Error(`${classDeclaration.name}.${property.name}: ${e.message}`);
      }
    }
  }
}

export function isRequiredProperty(property: AstPropertyDeclaration) {
  if (!property.type) {
    return true;
  }

  if (property.type.allowUndefined) {
    return false;
  }

  if (property.type.kind === 'union') {
    return !property.type.types.some(t => t.kind === 'null' || t.kind === 'undefined');
  }

  return true;
}
