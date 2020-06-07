import {parseRelationalSchemaTables} from './parse-relational-schema-tables';
import {AstVariable} from '../../ast/ast-variable';
import { RelationalSchemaDescription } from '@daita/orm';

export function parseRelationalSchema(
  schemaVariable: AstVariable,
): RelationalSchemaDescription {
  const schema = new RelationalSchemaDescription();

  parseRelationalSchemaTables(schema, schemaVariable);

  return schema;
}
