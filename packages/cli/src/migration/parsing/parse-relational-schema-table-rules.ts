import { RelationalTableDescription } from '@daita/orm';
import { AstVariableCallArgument } from '../../ast/ast-variable-call-argument';

export function parseRelationalSchemaTableRules(table: RelationalTableDescription, optionsArgument: AstVariableCallArgument | null) {
  const rules = optionsArgument?.objectValue?.property('rules');
  if (!rules) {
    return;
  }

  console.log(rules);
}
