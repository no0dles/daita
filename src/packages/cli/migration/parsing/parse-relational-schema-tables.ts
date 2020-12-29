import { parseRelationalSchemaTableFields } from './parse-relational-schema-table-fields';
import { parseRelationalSchemaTablePrimaryKeys } from './parse-relational-schema-table-primary-keys';
import { AstClassDeclaration } from '../../ast/ast-class-declaration';
import { parseRelationalSchemaTableReferences } from './parse-relational-schema-table-references';
import { parseTableDescription } from './parse-table-description';
import { parseRelationalSchemaTableIndices } from './parse-relational-schema-table-indices';
import { AstVariableDeclaration } from '../../ast/ast-variable-declaration';
import { AstObjectValue } from '../../ast/ast-object-value';
import { AstError } from '../../ast/utils';
import {
  addTableToSchema,
  containsTableInSchema,
  SchemaDescription,
  SchemaTableDescription,
} from '../../../orm/schema/description/relational-schema-description';

export function parseRelationalSchemaTables(schema: SchemaDescription, schemaVariable: AstVariableDeclaration) {
  const calls = schemaVariable.callsByName('table');
  const tables: { classDeclaration: AstClassDeclaration; table: SchemaTableDescription }[] = [];

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

    const table = addTableToSchema(schema, {
      table: tableDescription.table,
      schema: tableDescription.schema,
    });

    parseRelationalSchemaTableFields(table, classArgument, optionsObject);
    parseRelationalSchemaTablePrimaryKeys(table, optionsObject);

    if (optionsObject) {
      parseRelationalSchemaTableIndices(table, optionsObject);
    }

    tables.push({
      table,
      classDeclaration: classArgument,
    });
  }

  for (const table of tables) {
    parseRelationalSchemaTableReferences(schema, table.table, table.classDeclaration);
  }
}
