import { AstClassDeclaration } from '../../ast/ast-class-declaration';
import { parseTableDescription } from './parse-table-description';
import { AstReferenceType } from '../../ast/ast-reference-type';
import { isRequiredProperty } from './parse-relational-type';
import { addTableReference, getTableFromSchema, SchemaDescription } from '@daita/orm';
import { AstObjectValue } from '../../ast/ast-object-value';
import { AstObjectPropertyAssignmentValue } from '../../ast/ast-object-property-value';
import { AstStringLiteralValue } from '../../ast/ast-literal-value';
import { ForeignKeyConstraint, TableDescription } from '@daita/relational';

export function parseRelationalSchemaTableReferences(
  schema: SchemaDescription,
  table: TableDescription<any>,
  classDeclaration: AstClassDeclaration,
  optionsObject: AstObjectValue | null,
): SchemaDescription {
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

    let onUpdate: ForeignKeyConstraint | null = null;
    let onDelete: ForeignKeyConstraint | null = null;
    const foreignKeys = optionsObject?.prop('foreignKeys');
    if (foreignKeys) {
      const foreignKeysValue = foreignKeys.value;
      if (foreignKeysValue instanceof AstObjectValue) {
        const foreignKeyValue = foreignKeysValue.prop(property.name);
        if (foreignKeyValue instanceof AstObjectPropertyAssignmentValue) {
          if (foreignKeyValue.value instanceof AstObjectValue) {
            const onUpdateProp = foreignKeyValue.value.prop('onUpdate')?.value;
            if (onUpdateProp instanceof AstStringLiteralValue) {
              onUpdate = onUpdateProp.value as ForeignKeyConstraint;
            }
            const onDeleteProp = foreignKeyValue.value.prop('onDelete')?.value;
            if (onDeleteProp instanceof AstStringLiteralValue) {
              onDelete = onDeleteProp.value as ForeignKeyConstraint;
            }
          }
        }
      }
    }

    schema = addTableReference(schema, table, tableDescription, {
      name: property.name,
      required: isRequiredProperty(property),
      onUpdate,
      onDelete,
    });
  }

  return schema;
}
