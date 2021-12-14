import { AstCallExpression } from '../../ast/ast-call-expression';
import { AstValue } from '../../ast/ast-value';
import { AstArrayValue } from '../../ast/ast-array-value';
import { AstObjectValue } from '../../ast/ast-object-value';
import { AstVariableDeclaration } from '../../ast/ast-variable-declaration';
import { AstLiteralValue } from '../../ast/ast-literal-value';
import { AstClassDeclaration } from '../../ast/ast-class-declaration';
import { AstError } from '../../ast/utils';
import { AstKeywordValue } from '../../ast/ast-keyword-value';
import { AstRegularExpressionLiteral } from '../../ast/ast-regular-expression-literal';
import { AstPropertyAccessExpression } from '../../ast/ast-property-access-expression';
import { relative } from 'path';
import { AstFunctionDeclaration } from '../../ast/ast-function-declaration';

function convertFn(value: AstCallExpression) {
  const type = value.block.getType(value.methodName);
  if (!(type instanceof AstFunctionDeclaration)) {
    throw new AstError(value.node, 'expected function type');
  }
  const requirePath = relative(__dirname, getJavascriptFilename(type.block.sourceFile.fileName));
  const fn = require(requirePath)[value.methodName];
  const args: any[] = [];
  for (const arg of value.arguments) {
    args.push(convertValue(arg));
  }
  return fn.apply(fn, args);
}

export function getJavascriptFilename(fileName: string): string {
  if (fileName.endsWith('.d.ts')) {
    return fileName.substr(0, fileName.length - '.d.ts'.length) + '.js';
  }
  return fileName;
}

export function convertValue(value: AstValue): any {
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
        throw new AstError(prop.node, `unable to get value`);
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
  } else if (value instanceof AstKeywordValue) {
    return value.value;
  } else if (value instanceof AstRegularExpressionLiteral) {
    return value.regexp;
  } else if (value instanceof AstPropertyAccessExpression) {
    const srcValue = convertValue(value.source);
    return JSON.parse(JSON.stringify(srcValue[value.name])); //TODO check if regexp are a problem
  } else {
    throw new AstError(value.node, 'unable to convert to value');
  }
}

export function createClass(classDeclaration: AstClassDeclaration) {
  const classValue: any = function () {};

  Object.defineProperty(classValue, 'name', { value: classDeclaration.name });

  for (const prop of classDeclaration.staticProps) {
    if (prop.value) {
      classValue[prop.name] = convertValue(prop.value);
    }
  }

  return classValue;
}
