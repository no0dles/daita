import { AstBlock } from './ast-block';
import { AstNode } from './ast-node';
import { RegularExpressionLiteral } from 'typescript';

export class AstRegularExpressionLiteral implements AstNode {
  constructor(private block: AstBlock, public node: RegularExpressionLiteral) {}

  get regexp() {
    return new RegExp(this.node.text.slice(1, this.node.text.length - 1));
  }
}
