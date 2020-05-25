import { AstVariable } from '../../ast/ast-variable';
import { RelationalSchemaDescription, RelationalTableDescription } from '@daita/orm';
import { parseRelationalSchemaTableFields } from './parse-relational-schema-table-fields';
import { parseRelationalSchemaTablePrimaryKeys } from './parse-relational-schema-table-primary-keys';
import { AstClassDeclaration } from '../../ast/ast-class-declaration';
import { parseRelationalSchemaTableReferences } from './parse-relational-schema-table-references';

export function parseRelationalSchemaTables(
  schema: RelationalSchemaDescription, schemaVariable: AstVariable,
) {
  const calls = schemaVariable.getCalls({ name: 'table' });
  const classDeclarations: { [key: string]: AstClassDeclaration } = {};

  for (const call of calls) {
    const classArgument = call.argument(0);
    const optionsArgument = call.argument(1);

    if (!classArgument) {
      throw new Error('invalid table argument without class');
    }
    const classDeclaration = classArgument.classDeclaration;
    if (!classDeclaration) {
      throw new Error(`unable to find class ${classArgument.className} in schema ${schemaVariable.name}`);
    }

    if (!classDeclaration.name) {
      throw new Error('missing class name');
    }

    if (schema.containsTable(classDeclaration.name)) {
      throw new Error('name already registered');
    }

    if (!classDeclaration.name) {
      throw new Error(`missing table class name`);
    }

    const table = new RelationalTableDescription(
      schema,
      classDeclaration.name,
      classDeclaration.name,
      undefined, //TODO schema static
    );

    parseRelationalSchemaTableFields(table, classDeclaration);
    parseRelationalSchemaTablePrimaryKeys(table, optionsArgument);

    schema.addTable(classDeclaration.name, table);
    classDeclarations[classDeclaration.name] = classDeclaration;
  }

  for(const table of schema.tables) {
    parseRelationalSchemaTableReferences(schema, table, classDeclarations[table.name]);
  }
}
