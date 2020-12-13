import { capitalize } from '../utils';
import { AstClassDeclaration } from '../../ast/ast-class-declaration';
import { parseTableDescription } from './parse-table-description';
import { AstReferenceType } from '../../ast/ast-reference-type';
import { isRequiredProperty } from './parse-relational-type';
import { RelationalTableReferenceKeyDescription } from '../../../orm/schema/description/relational-table-reference-key-description';
import { RelationalTableFieldDescription } from '../../../orm/schema/description/relational-table-field-description';
import { RelationalTableReferenceDescription } from '../../../orm/schema/description/relational-table-reference-description';
import { RelationalSchemaDescription } from '../../../orm/schema/description/relational-schema-description';
import { RelationalTableDescription } from '../../../orm/schema/description/relational-table-description';

export function parseRelationalSchemaTableReferences(
  schema: RelationalSchemaDescription,
  table: RelationalTableDescription,
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
    const referenceTable = schema.table(tableDescription);
    if (!referenceTable) {
      throw new Error('reference not registered');
    }

    const keys: RelationalTableReferenceKeyDescription[] = [];

    for (const primaryKey of referenceTable.primaryKeys) {
      const key = `${property.name}${capitalize(primaryKey.name)}`;
      let keyField: RelationalTableFieldDescription;

      if (!table.containsField(key)) {
        keyField = new RelationalTableFieldDescription(
          table,
          key,
          key,
          primaryKey.type,
          undefined,
          isRequiredProperty(property),
          undefined,
        );
        table.addField(key, keyField);
      } else {
        keyField = table.field(key);
        if (keyField.type !== primaryKey.type) {
          throw new Error(`property ${key} type ${keyField.type} is not as foreign key type ${primaryKey.type}`);
        }
      }

      keys.push({ field: keyField, foreignField: primaryKey });
    }

    table.addReference(property.name, new RelationalTableReferenceDescription(property.name, referenceTable, keys));
  }
}
