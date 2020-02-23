import {
  RelationalTableSchema,
} from '@daita/core';
import {DatabaseSchema} from '@daita/core/dist/schema/database-schema';
import {parseRelationalSchemaTables} from './parse-relational-schema-tables';
import {AstVariable} from '../../ast/ast-variable';
import {parseSchemaPermissions} from './parse-schema-permissions';
import {parseRelationalSchemaTable} from './parse-relational-schema-table';
import {capitalize} from '../utils';
import {DatabaseSchemaTable} from '@daita/core/dist/schema/database-schema-table';

export function parseRelationalSchema(
  schemaVariable: AstVariable,
): RelationalTableSchema {
  const schemaTableMap = parseRelationalSchemaTables(schemaVariable);
  const permissionMap = parseSchemaPermissions(schemaVariable);

  const tableMap: { [key: string]: DatabaseSchemaTable } = {};
  for (const key of Object.keys(schemaTableMap)) {
    tableMap[key] = parseRelationalSchemaTable(schemaTableMap[key], schemaTableMap);
  }

  for (const tableKey of Object.keys(tableMap)) {
    const table = tableMap[tableKey];
    for (const foreignKey of table.foreignKeys) {
      const referenceTable = tableMap[foreignKey.table];
      for (const referenceKey of foreignKey.foreignKeys) {
        const key = `${foreignKey.name}${capitalize(referenceKey)}`;
        const referenceField = referenceTable.field(referenceKey);
        const keyField = table.field(key);

        if (!referenceField) {
          throw new Error('could not find primary key of foreign key');
        }

        if (!keyField) {
          table.addField({
            required: foreignKey.required,
            name: key,
            type: referenceField.type,
            defaultValue: undefined,
          });
        } else {
          if (keyField.required !== foreignKey.required) {
            throw new Error('key not required as foreign key');
          }
          if (keyField.type !== referenceField.type) {
            throw new Error('key type as foreign key');
          }
        }
      }
    }
  }

  return new DatabaseSchema({}, tableMap, permissionMap);
}
