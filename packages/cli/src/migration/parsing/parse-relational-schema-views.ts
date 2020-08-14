import { RelationalSchemaDescription, RelationalViewDescription } from '@daita/orm';
import { AstVariableDeclaration } from '../../ast/ast-variable-declaration';
import { AstClassDeclaration } from '../../ast/ast-class-declaration';
import { convertValue } from './convert-value';
import { AstError } from '../../ast/utils';
import { parseTableDescription } from './parse-table-description';

export function parseRelationalSchemaViews(
  schema: RelationalSchemaDescription, schemaVariable: AstVariableDeclaration,
) {
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
    schema.addView(tableDescription, new RelationalViewDescription(schema, query,
      tableDescription.table, tableDescription.table, tableDescription.schema));
  }
}
