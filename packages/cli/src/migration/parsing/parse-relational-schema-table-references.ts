import { capitalize } from '../utils';
import {
  RelationalSchemaDescription,
  RelationalTableDescription, RelationalTableFieldDescription,
  RelationalTableReferenceDescription, RelationalTableReferenceKeyDescription,
} from '@daita/orm';
import { AstClassDeclaration } from '../../ast/ast-class-declaration';
import { isRequiredProperty } from './parse-relational-schema-table-fields';

export function parseRelationalSchemaTableReferences(schema: RelationalSchemaDescription, table: RelationalTableDescription, classDeclaration: AstClassDeclaration) {
  for (const property of classDeclaration.getProperties({ includedInherited: true })) {
    if (!property.name) {
      throw new Error('missing prop name');
    }

    if (property.type && property.type.kind === 'reference' && property.type.referenceName !== 'Date') {
      const referenceClass = property.type.reference;
      if (!referenceClass) {
        throw new Error('invalid reference');
      }

      if (!referenceClass.name) {
        throw new Error('reference name is missing');
      }

      const referenceTable = schema.table(referenceClass.name);
      if (!referenceTable) {
        throw new Error('reference not registered');
      }

      const keys: RelationalTableReferenceKeyDescription[] = [];

      for (const primaryKey of referenceTable.primaryKeys) {
        const key = `${property.name}${capitalize(primaryKey.name)}`;
        let keyField: RelationalTableFieldDescription;

        if (!table.containsField(key)) {
          keyField = new RelationalTableFieldDescription(table, key, key, primaryKey.type, isRequiredProperty(property), undefined);
          table.addField(key, keyField);
        } else {
          keyField = table.field(key);
          if (keyField.required !== primaryKey.required) {
            throw new Error('key not required as foreign key');
          }
          if (keyField.type !== primaryKey.type) {
            throw new Error('key type as foreign key');
          }
        }

        keys.push({ field: keyField, foreignField: primaryKey });
      }

      table.addReference(property.name, new RelationalTableReferenceDescription(
        property.name,
        referenceTable,
        keys,
      ));
    }
  }
}
