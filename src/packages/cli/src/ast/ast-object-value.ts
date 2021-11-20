import {
  AstError,
  getArrayValue,
  getBooleanValue,
  getName,
  getStringValue,
  isKind,
} from '../ast/utils';
import {
  AstObjectPropertyAssignmentValue,
  AstObjectPropertyShorthandValue,
  AstObjectPropertyValue,
} from './ast-object-property-value';
import { ObjectLiteralExpression, SyntaxKind } from 'typescript';
import { AstValue } from './ast-value';
import { AstBlock } from './ast-block';
import { AstNode } from './ast-node';

export class AstObjectValue implements AstNode {
  constructor(private block: AstBlock, public node: ObjectLiteralExpression) {}

  get props(): Generator<AstObjectPropertyValue> {
    return this.getProps();
  }

  stringProp(name: string) {
    const prop = this.requiredProp(name);
    if (!prop.value) {
      throw new AstError(this.node, 'prop ' + name + ' has no value');
    }
    return getStringValue(prop.value);
  }

  arrayProp<T>(name: string, fn: (elm: AstValue) => T): T[] {
    const prop = this.requiredProp(name);
    if (!prop.value) {
      throw new AstError(this.node, 'prop ' + name + ' has no value');
    }
    return getArrayValue(prop.value, fn);
  }

  hasProp(name: string) {
    for (const prop of this.props) {
      if (prop.name === name) {
        return true;
      }
    }
    return false;
  }

  booleanProp(name: string) {
    const prop = this.requiredProp(name);
    if (!prop.value) {
      throw new AstError(this.node, 'prop ' + name + ' has no value');
    }
    return getBooleanValue(prop.value);
  }

  requiredProp(name: string) {
    const prop = this.prop(name);
    if (prop) {
      return prop;
    }
    throw new AstError(this.node, 'missing prop ' + name);
  }

  prop(name: string) {
    for (const prop of this.props) {
      if (prop.name === name) {
        return prop;
      }
    }
    return null;
  }

  private *getProps(): Generator<AstObjectPropertyValue> {
    for (const property of this.node.properties) {
      const propertyAssignment = isKind(
        property,
        SyntaxKind.PropertyAssignment,
      );
      if (propertyAssignment) {
        yield new AstObjectPropertyAssignmentValue(
          this.block,
          propertyAssignment,
        );
      }
      const shorthandPropertyAssignment = isKind(
        property,
        SyntaxKind.ShorthandPropertyAssignment,
      );
      if (shorthandPropertyAssignment) {
        yield new AstObjectPropertyShorthandValue(
          this.block,
          shorthandPropertyAssignment,
        );
      }
      const spreadAssignment = isKind(property, SyntaxKind.SpreadAssignment);
      if (spreadAssignment) {
        const variableName = getName(
          spreadAssignment.expression,
          'spread assignment',
        );
        const variable = this.block.variable(variableName);
        if (!variable) {
          throw new AstError(this.node, 'unable to find variable');
        }
        const variableValue = variable.value;
        if (variableValue instanceof AstObjectValue) {
          for (const variableProp of variableValue.props) {
            yield variableProp;
          }
        }
      }
    }
  }

  // type: AstType;
  // functionCalls: AstCallExpression[];
}
