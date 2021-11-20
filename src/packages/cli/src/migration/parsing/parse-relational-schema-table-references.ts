import { AstClassDeclaration } from '../../ast/ast-class-declaration';
import { parseTableDescription } from './parse-table-description';
import { AstReferenceType } from '../../ast/ast-reference-type';
import { isRequiredProperty } from './parse-relational-type';
import {
  addTableReference,
  getTableFromSchema,
  SchemaDescription,
  SchemaTableDescription,
} from '@daita/orm/schema/description/relational-schema-description';

export function parseRelationalSchemaTableReferences(
  schema: SchemaDescription,
  table: SchemaTableDescription,
  classDeclaration: AstClassDeclaration,
) {
  for (const property of classDeclaration.allProps) {
    if (!property.name) {
      throw new Error('missing prop name');
    }

    if (!(property.type instanceof AstReferenceType)) {
      continue;
    }

    if (property.type.name === 'Date') {
      continue;
    }

    const referencedType = property.type.referenceType;
    if (!(referencedType instanceof AstClassDeclaration)) {
      continue;
    }

    const tableDescription = parseTableDescription(referencedType);
    const referenceTable = getTableFromSchema(schema, tableDescription);
    if (!referenceTable) {
      throw new Error('reference not registered');
    }

    addTableReference(table, {
      referenceTable: referenceTable.table,
      referenceTableKey: referenceTable.table.name,
      name: property.name,
      required: isRequiredProperty(property),
    });
  }
}
