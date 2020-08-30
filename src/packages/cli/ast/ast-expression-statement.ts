import { AstBlock } from './ast-block';
import { ExpressionStatement, SyntaxKind } from 'typescript';
import { isKind } from './utils';
import { AstCallExpression } from './ast-call-expression';

export class AstExpressionStatement {
  constructor(private block: AstBlock,
              private node: ExpressionStatement) {
  }

  get callExpression(): AstCallExpression | null {
    const callExpression = isKind(this.node.expression, SyntaxKind.CallExpression);
    if (callExpression) {
      return new AstCallExpression(this.block, callExpression);
    }
    return null;
  }
}
