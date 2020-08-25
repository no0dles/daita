import { RelationalSchemaDescription, RelationalTableDescription } from '@daita/orm';
import { parseRelationalSchemaTableFields } from './parse-relational-schema-table-fields';
import { parseRelationalSchemaTablePrimaryKeys } from './parse-relational-schema-table-primary-keys';
import { AstClassDeclaration } from '../../ast/ast-class-declaration';
import { parseRelationalSchemaTableReferences } from './parse-relational-schema-table-references';
import { parseTableDescription } from './parse-table-description';
import { parseRelationalSchemaTableIndices } from './parse-relational-schema-table-indices';
import { AstVariableDeclaration } from '../../ast/ast-variable-declaration';
import { AstObjectValue } from '../../ast/ast-object-value';
import { AstError } from '../../ast/utils';

export function parseRelationalSchemaTables(
  schema: RelationalSchemaDescription, schemaVariable: AstVariableDeclaration,
) {
  const calls = schemaVariable.callsByName('table');
  const classDeclarations: { [key: string]: AstClassDeclaration } = {};

  for (const call of calls) {
    const classArgument = call.argumentAt(0);
    const optionsArgument = call.argumentAt(1);

    if (!(classArgument instanceof AstClassDeclaration)) {
      throw new AstError(classArgument?.node ?? call.node, 'invalid table argument without class');
    }

    let optionsObject: AstObjectValue | null = null;

    if (optionsArgument instanceof AstObjectValue) {
      optionsObject = optionsArgument;
    } else if (optionsArgument instanceof AstVariableDeclaration) {
      const variableValue = optionsArgument.value;
      if (variableValue instanceof AstObjectValue) {
        optionsObject = variableValue;
      }
    }

    const tableDescription = parseTableDescription(classArgument);

    if (schema.containsTable(tableDescription)) {
      throw new Error('name already registered');
    }

    if (!classArgument.name) {
      throw new Error(`missing table class name`);
    }

    const table = new RelationalTableDescription(
      schema,
      tableDescription.table,
      tableDescription.table,
      tableDescription.schema,
    );

    parseRelationalSchemaTableFields(table, classArgument);
    parseRelationalSchemaTablePrimaryKeys(table, optionsObject);

    if (optionsObject) {
      parseRelationalSchemaTableIndices(table, optionsObject);
    }

    schema.addTable(tableDescription, table);
    classDeclarations[classArgument.name] = classArgument;
  }

  for (const table of schema.tables) {
    parseRelationalSchemaTableReferences(schema, table, classDeclarations[table.name]);
  }
}
