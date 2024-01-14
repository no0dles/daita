import { AstVariableDeclaration } from '../../ast/ast-variable-declaration';
import { AstClassDeclaration } from '../../ast/ast-class-declaration';
import { convertValue } from './convert-value';
import { AstError } from '../../ast/utils';
import { parseTableDescription } from './parse-table-description';
import { addViewToSchema, SchemaDescription } from '@daita/orm';

export function parseRelationalSchemaViews(
  schema: SchemaDescription,
  schemaVariable: AstVariableDeclaration,
): SchemaDescription {
  const calls = schemaVariable.callsByName('view');
  for (const call of calls) {
    const classArgument = call.argumentAt(0);
    const queryArgument = call.argumentAt(1);

    if (!(classArgument instanceof AstClassDeclaration)) {
      throw new Error('invalid view argument without class');
    }

    if (!queryArgument) {
      throw new AstError(call.node, 'missing query argument');
    }

    const tableDescription = parseTableDescription(classArgument);
    const query = convertValue(queryArgument);
    schema = addViewToSchema(schema, {
      query,
      name: tableDescription.table,
      schema: tableDescription.schema,
    });
  }
  return schema;
}
