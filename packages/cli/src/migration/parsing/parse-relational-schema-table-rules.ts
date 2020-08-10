import { RelationalTableDescription } from '@daita/orm';
import { AstObjectValue } from '../../ast/ast-object-value';
import { AstArrayValue } from '../../ast/ast-array-value';
import { AstVariableDeclaration } from '../../ast/ast-variable-declaration';
import { AstCallExpression } from '../../ast/ast-call-expression';
import { AstValue } from '../../ast/ast-value';
import * as relational from '@daita/relational';
import { AstLiteralValue } from '../../ast/ast-literal-value';
import { AstClassDeclaration } from '../../ast/ast-class-declaration';

export function parseRelationalSchemaTableRules(table: RelationalTableDescription, optionsArgument: AstObjectValue) {
  const rules = optionsArgument.prop('rules');
  if (!rules) {
    return;
  }

  let rulesValue = rules.value;
  if (rulesValue instanceof AstVariableDeclaration) {
    rulesValue = rulesValue.value;
  }
  if (!(rulesValue instanceof AstArrayValue)) {
    throw new Error('rules needs to be an array');
  }

  for (const ruleElement of rulesValue.elements) {
    const rule = convertValue(ruleElement);
    table.addRule(rule);
  }
}

function convertFn(value: AstCallExpression) {
  const fn = (relational as any)[value.methodName];
  const args: any[] = [];
  for (const arg of value.arguments) {
    args.push(convertValue(arg));
  }
  return fn.apply(fn, args);
}

function convertValue(value: AstValue): any {
  if (value instanceof AstCallExpression) {
    return convertFn(value);
  } else if (value instanceof AstArrayValue) {
    const values: any[] = [];
    for (const elm of value.elements) {
      values.push(convertValue(elm));
    }
    return values;
  } else if (value instanceof AstObjectValue) {
    const obj: any = {};
    for (const prop of value.props) {
      if (prop.value) {
        obj[prop.name] = convertValue(prop.value);
      } else {
        //TODO
        console.log(prop);
      }
    }
    return obj;
  } else if (value instanceof AstVariableDeclaration) {
    if (value.value) {
      return convertValue(value.value);
    }
    return null;
  } else if (value instanceof AstLiteralValue) {
    return value.value;
  } else if (value instanceof AstClassDeclaration) {
    return createClass(value);
  } else {
    throw new Error('unknown val');
  }
}

export function createClass(classDeclaration: AstClassDeclaration) {
  const classValue: any = {};

  classValue.name = classDeclaration.name;

  for (const prop of classDeclaration.staticProps) {
    if (prop.value) {
      classValue[prop.name] = convertValue(prop.value);
    }
  }

  return classValue;
}
