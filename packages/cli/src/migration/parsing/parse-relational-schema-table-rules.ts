import { RelationalSchemaDescription } from '@daita/orm';
import { AstArrayValue } from '../../ast/ast-array-value';
import { AstVariableDeclaration } from '../../ast/ast-variable-declaration';
import { AstError } from '../../ast/utils';
import { convertValue } from './convert-value';

export function parseRelationalSchemaTableRules(schema: RelationalSchemaDescription, schemaVariable: AstVariableDeclaration) {
  const rules = schemaVariable.callsByName('rules');
  for (const rule of rules) {
    let ruleValue = rule.argumentAt(0);
    if (ruleValue instanceof AstVariableDeclaration) {
      ruleValue = ruleValue.value;
    }

    if (ruleValue instanceof AstArrayValue) {
      for (const ruleElement of ruleValue.elements) {
        const rule = convertValue(ruleElement);
        schema.addRule(rule);
      }
    } else {
      throw new AstError(ruleValue?.node ?? rule.node, 'unable to parse rules');
    }
  }
}
