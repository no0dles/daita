import { getRawValue, isRequiredProperty, parseRelationalType } from './parse-relational-type';
import { AstClassDeclaration } from '../../ast/ast-class-declaration';
import { AstReferenceType } from '../../ast/ast-reference-type';
import { RelationalTableFieldDescription } from '../../../orm/schema/description/relational-table-field-description';
import { RelationalTableDescription } from '../../../orm/schema/description/relational-table-description';
import { AstObjectValue } from '../../ast/ast-object-value';
import { AstLiteralType } from '../../ast/ast-literal-type';
import { AstObjectPropertyAssignmentValue } from '../../ast/ast-object-property-value';
import { AstNumericLiteralValue } from '../../ast/ast-literal-value';

export function parseRelationalSchemaTableFields(
  table: RelationalTableDescription,
  classDeclaration: AstClassDeclaration,
  optionsValue: AstObjectValue | null,
) {
  for (const property of classDeclaration.allProps) {
    if (!property.name) {
      throw new Error('missing prop name');
    }

    if (!property.type) {
      throw new Error('missing prop type');
    }

    if (property.type instanceof AstReferenceType && property.type.referenceType instanceof AstClassDeclaration) {
      continue;
    }

    let size: number | undefined = undefined;
    const columns = optionsValue?.prop('columns');
    if (columns) {
      const columnsValue = columns.value;
      if (columnsValue instanceof AstObjectValue) {
        const columnValue = columnsValue.prop(property.name);
        if (columnValue instanceof AstObjectPropertyAssignmentValue) {
          if (columnValue.value instanceof AstObjectValue) {
            const sizeProp = columnValue.value.prop('size')?.value;
            if (sizeProp instanceof AstNumericLiteralValue) {
              size = sizeProp.value;
            }
          }
        }
      }
    }

    const type = parseRelationalType(property.type);
    table.addField(
      property.name,
      new RelationalTableFieldDescription(
        table,
        property.name,
        property.name,
        type,
        size,
        isRequiredProperty(property),
        getRawValue(property.value),
      ),
    );
  }
}
