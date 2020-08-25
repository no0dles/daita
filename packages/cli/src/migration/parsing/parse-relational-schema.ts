import {parseRelationalSchemaTables} from './parse-relational-schema-tables';
import { RelationalSchemaDescription } from '@daita/orm';
import { AstVariableDeclaration } from '../../ast/ast-variable-declaration';
import { parseRelationalSchemaTableRules } from './parse-relational-schema-table-rules';
import { parseRelationalSchemaViews } from './parse-relational-schema-views';
import { parseRelationalSchemaTableSeed } from './parse-relational-schema-table-seed';

export function parseRelationalSchema(
  schemaVariable: AstVariableDeclaration,
): RelationalSchemaDescription {
  const schema = new RelationalSchemaDescription();

  parseRelationalSchemaTables(schema, schemaVariable);
  parseRelationalSchemaTableSeed(schema, schemaVariable);
  parseRelationalSchemaTableRules(schema, schemaVariable);
  parseRelationalSchemaViews(schema, schemaVariable);

  return schema;
}
