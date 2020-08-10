import {
  getName,
  getTypeFromTypeOrExpression,
  getValueFromExpression,
  hasModifier,
} from './utils';
import { AstBlock } from './ast-block';
import { SyntaxKind, VariableDeclaration, VariableStatement } from 'typescript';
import { AstType } from './ast-type';
import { AstValue } from './ast-value';
import { AstCallExpression } from './ast-call-expression';
import { AstNode } from './ast-node';

export class AstVariableDeclaration implements AstNode {
  constructor(private block: AstBlock,
              private variableStatement: VariableStatement,
              public node: VariableDeclaration) {
  }

  get sourceFile() {
    return this.block.sourceFile;
  }

  get exported(): boolean {
    return hasModifier(this.variableStatement.modifiers, SyntaxKind.ExportKeyword);
  }

  get name(): string {
    return getName(this.node.name, 'variable declaration');
  }

  get type(): AstType | null {
    return getTypeFromTypeOrExpression(this.block, this.node.type, this.node.initializer);
  }

  get value(): AstValue | null {
    return getValueFromExpression(this.block, this.node.initializer);
  }

  get calls() {
    return this.getCalls();
  }

  * callsByName(name: string) {
    for (const call of this.calls) {
      if (call.methodName === name) {
        yield call;
      }
    }
  }

  private* getCalls(): Generator<AstCallExpression> {
    const name = this.name;
    for (const expresionStatement of this.block.expressionStatements) {
      const call = expresionStatement.callExpression;
      if (call && call.variableName === name) {
        yield call;
      }
    }
  }
}
