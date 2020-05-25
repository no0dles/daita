import {parseRelationalSchemaTables} from './parse-relational-schema-tables';
import {AstVariable} from '../../ast/ast-variable';
import {parseSchemaPermissions} from './parse-schema-permissions';
import { RelationalSchemaDescription } from '@daita/orm';

export function parseRelationalSchema(
  schemaVariable: AstVariable,
): RelationalSchemaDescription {
  const schema = new RelationalSchemaDescription();

  parseRelationalSchemaTables(schema, schemaVariable);
  parseSchemaPermissions(schema, schemaVariable);

  return schema;
}
