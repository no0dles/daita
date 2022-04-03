import { AstNode } from './ast-node';
import { ArrowFunction, SyntaxKind } from 'typescript';
import { AstBlock } from './ast-block';
import { isKind } from './utils';
import { AstCallExpression } from './ast-call-expression';

export class AstArrowFunction implements AstNode {
  constructor(private block: AstBlock, public node: ArrowFunction) {}

  *callStatements(): Generator<AstCallExpression> {
    const body = this.node.body;

    if (isKind(body, SyntaxKind.Block)) {
      const astBlock = new AstBlock(this.block.sourceFile, body, this.block);
      for (const statement of body.statements) {
        if (
          isKind(statement, SyntaxKind.ExpressionStatement) &&
          isKind(statement.expression, SyntaxKind.CallExpression)
        ) {
          yield new AstCallExpression(astBlock, statement.expression);
        }
      }
    } else if (isKind(body, SyntaxKind.CallExpression)) {
      yield new AstCallExpression(this.block, body);
    }
  }
}
