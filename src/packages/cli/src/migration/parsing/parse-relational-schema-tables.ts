import { parseRelationalSchemaTableFields } from './parse-relational-schema-table-fields';
import { parseRelationalSchemaTablePrimaryKeys } from './parse-relational-schema-table-primary-keys';
import { AstClassDeclaration } from '../../ast/ast-class-declaration';
import { parseRelationalSchemaTableReferences } from './parse-relational-schema-table-references';
import { parseTableDescription } from './parse-table-description';
import { parseRelationalSchemaTableIndices } from './parse-relational-schema-table-indices';
import { AstVariableDeclaration } from '../../ast/ast-variable-declaration';
import { AstObjectValue } from '../../ast/ast-object-value';
import { AstError } from '../../ast/utils';
import { addTableToSchema, containsTableInSchema, SchemaDescription } from '@daita/orm';
import { TableDescription } from '@daita/relational';

export function parseRelationalSchemaTables(
  schema: SchemaDescription,
  schemaVariable: AstVariableDeclaration,
): SchemaDescription {
  const calls = schemaVariable.callsByName('table');
  const tables: {
    classDeclaration: AstClassDeclaration;
    tableDescription: TableDescription<any>;
    optionsObject: AstObjectValue | null;
  }[] = [];

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

    if (containsTableInSchema(schema, tableDescription)) {
      throw new Error('name already registered');
    }

    if (!classArgument.name) {
      throw new Error(`missing table class name`);
    }

    schema = addTableToSchema(schema, tableDescription);

    schema = parseRelationalSchemaTableFields(schema, tableDescription, classArgument, optionsObject);
    schema = parseRelationalSchemaTablePrimaryKeys(schema, tableDescription, optionsObject);

    if (optionsObject) {
      schema = parseRelationalSchemaTableIndices(schema, tableDescription, optionsObject);
    }

    tables.push({
      tableDescription,
      classDeclaration: classArgument,
      optionsObject,
    });
  }

  for (const table of tables) {
    schema = parseRelationalSchemaTableReferences(
      schema,
      table.tableDescription,
      table.classDeclaration,
      table.optionsObject,
    );
  }

  return schema;
}
