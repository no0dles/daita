import {
  getRawValue,
  isRequiredProperty,
  parseRelationalType,
} from './parse-relational-type';
import { AstClassDeclaration } from '../../ast/ast-class-declaration';
import { AstReferenceType } from '../../ast/ast-reference-type';
import {
  RelationalTableDescription,
  RelationalTableFieldDescription,
} from '../../../orm/schema';

export function parseRelationalSchemaTableFields(
  table: RelationalTableDescription,
  classDeclaration: AstClassDeclaration,
) {
  for (const property of classDeclaration.allProps) {
    if (!property.name) {
      throw new Error('missing prop name');
    }

    if (!property.type) {
      throw new Error('missing prop type');
    }

    if (
      property.type instanceof AstReferenceType &&
      property.type.referenceType instanceof AstClassDeclaration
    ) {
      continue;
    }

    const type = parseRelationalType(property.type);
    table.addField(
      property.name,
      new RelationalTableFieldDescription(
        table,
        property.name,
        property.name,
        type,
        isRequiredProperty(property),
        getRawValue(property.value),
      ),
    );
  }
}
