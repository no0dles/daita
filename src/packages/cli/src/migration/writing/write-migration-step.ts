import { Expression, factory, ObjectLiteralElementLike } from 'typescript';

function createObject(object: any) {
  const keys = Object.keys(object);
  const properties = new Array<ObjectLiteralElementLike>();
  for (const key of keys) {
    properties.push(factory.createPropertyAssignment(key, createExpressionFromValue(object[key])));
  }
  return factory.createObjectLiteralExpression(properties);
}

export function createExpressionFromValue(value: any): Expression {
  if (value === undefined) {
    return factory.createIdentifier('undefined');
  } else if (value === null) {
    return factory.createNull();
  } else if (typeof value === 'string') {
    return factory.createStringLiteral(value);
  } else if (typeof value === 'number') {
    return factory.createNumericLiteral(value.toString());
  } else if (typeof value === 'boolean') {
    return value ? factory.createTrue() : factory.createFalse();
  } else if (typeof value === 'object') {
    if (Array.isArray(value)) {
      return factory.createArrayLiteralExpression(value.map((item) => createExpressionFromValue(item)));
    } else if (value instanceof RegExp) {
      return factory.createRegularExpressionLiteral(value.toString());
    } else {
      return createObject(value);
    }
  } else {
    throw new Error('unknown type ' + typeof value + ', ' + value);
  }
}
