import {parseRelationalSchemaTables} from './parse-relational-schema-tables';
import { RelationalSchemaDescription } from '@daita/orm';
import { AstVariableDeclaration } from '../../ast/ast-variable-declaration';

export function parseRelationalSchema(
  schemaVariable: AstVariableDeclaration,
): RelationalSchemaDescription {
  const schema = new RelationalSchemaDescription();

  parseRelationalSchemaTables(schema, schemaVariable);

  return schema;
}
