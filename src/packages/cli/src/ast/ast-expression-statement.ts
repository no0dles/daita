import { AstBlock } from './ast-block';
import { ExpressionStatement, SyntaxKind } from 'typescript';
import { isKind } from './utils';
import { AstCallExpression } from './ast-call-expression';

export class AstExpressionStatement {
  constructor(private block: AstBlock, private node: ExpressionStatement) {}

  get callExpression(): AstCallExpression | null {
    if (isKind(this.node.expression, SyntaxKind.CallExpression)) {
      return new AstCallExpression(this.block, this.node.expression);
    }
    return null;
  }
}
