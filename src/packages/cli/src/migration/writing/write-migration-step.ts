import * as ts from 'typescript';

function createObject(object: any) {
  const keys = Object.keys(object);
  const properties = new Array<ts.ObjectLiteralElementLike>();
  for (const key of keys) {
    properties.push(
      ts.createPropertyAssignment(key, createExpressionFromValue(object[key])),
    );
  }
  return ts.createObjectLiteral(properties);
}

export function createExpressionFromValue(value: any): ts.Expression {
  if (value === undefined) {
    return ts.createIdentifier('undefined');
  } else if (value === null) {
    return ts.createNull();
  } else if (typeof value === 'string') {
    return ts.createStringLiteral(value);
  } else if (typeof value === 'number') {
    return ts.createNumericLiteral(value.toString());
  } else if (typeof value === 'boolean') {
    return value ? ts.createTrue() : ts.createFalse();
  } else if (typeof value === 'object') {
    if (Array.isArray(value)) {
      return ts.createArrayLiteral(
        value.map((item) => createExpressionFromValue(item)),
      );
    } else if (value instanceof RegExp) {
      return ts.createRegularExpressionLiteral(value.toString());
    } else {
      return createObject(value);
    }
  } else {
    throw new Error('unknown type ' + typeof value + ', ' + value);
  }
}
