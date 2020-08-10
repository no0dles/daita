import { AstMethodDeclaration } from './ast-method-declaration';
import { AstValue } from './ast-value';
import { AstBlock } from './ast-block';
import { CallExpression, SyntaxKind } from 'typescript';
import { AstVariableDeclaration } from './ast-variable-declaration';
import { AstError, getName, getValueFromExpression, isKind } from './utils';
import { AstNewExpression } from './ast-new-expression';
import { AstNode } from './ast-node';

export class AstCallExpression implements AstNode {
  constructor(private block: AstBlock,
              public node: CallExpression) {
  }

  get variableName(): string | null {
    const propertyAccess = isKind(this.node.expression, SyntaxKind.PropertyAccessExpression);
    if (propertyAccess) {
      return getName(propertyAccess.expression, 'call expression');
    }
    return null;
  }

  get variable(): AstVariableDeclaration | null {
    const variableName = this.variableName;
    if (variableName) {
      return this.block.variable(variableName);
    }
    return null;
  }

  get methodName(): string {
    const propertyAccess = isKind(this.node.expression, SyntaxKind.PropertyAccessExpression);
    if (propertyAccess) {
      return getName(propertyAccess.name, 'call expression');
    }
    const identifier = isKind(this.node.expression, SyntaxKind.Identifier);
    if (identifier) {
      return getName(identifier, 'call expression');
    }
    throw new AstError(this.node, 'unknown method name');
  }

  get method(): AstMethodDeclaration | null {
    const variable = this.variable;
    const methodName = this.methodName;
    if (variable && methodName) {
      if (variable.value instanceof AstNewExpression) {
        const classType = variable.value.type;
        if (classType) {
          return classType.method(methodName);
        }
      }
    }
    return null;
  }

  get arguments(): Generator<AstValue> {
    return this.getArguments();
  }

  argumentAt(index: number): AstValue | null {
    let i = 0;
    for (const argument of this.getArguments()) {
      if (i === index) {
        return argument;
      }
      i++;
    }
    return null;
  }

  private* getArguments() {
    for (const argument of this.node.arguments) {
      yield getValueFromExpression(this.block, argument);
    }
  }
}
