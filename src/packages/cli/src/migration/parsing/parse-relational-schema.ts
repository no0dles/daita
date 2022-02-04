import { parseRelationalSchemaTables } from './parse-relational-schema-tables';
import { AstVariableDeclaration } from '../../ast/ast-variable-declaration';
import { parseRelationalSchemaTableRules } from './parse-relational-schema-table-rules';
import { parseRelationalSchemaViews } from './parse-relational-schema-views';
import { parseRelationalSchemaTableSeed } from './parse-relational-schema-table-seed';
import { AstNewExpression } from '../../ast/ast-new-expression';
import { AstError } from '../../ast/utils';
import { convertValue } from './convert-value';
import { SchemaDescription } from '@daita/orm';

export function parseRelationalSchemaName(schemaVariable: AstVariableDeclaration) {
  const initializer = schemaVariable.value;
  if (!initializer || !(initializer instanceof AstNewExpression)) {
    throw new AstError(initializer?.node ?? schemaVariable.node, 'missing initalizer');
  }

  const nameArg = initializer.argumentAt(0);
  if (!nameArg) {
    throw new AstError(initializer.node, 'missing name argument');
  }
  return convertValue(nameArg);
}

export function parseRelationalSchema(schemaVariable: AstVariableDeclaration): SchemaDescription {
  const nameValue = parseRelationalSchemaName(schemaVariable);
  const schema: SchemaDescription = { rules: {}, tables: {}, views: {}, name: nameValue };

  parseRelationalSchemaTables(schema, schemaVariable);
  parseRelationalSchemaTableSeed(schema, schemaVariable);
  parseRelationalSchemaTableRules(schema, schemaVariable);
  parseRelationalSchemaViews(schema, schemaVariable);

  return schema;
}
