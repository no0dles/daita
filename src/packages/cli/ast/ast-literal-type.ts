import { LiteralTypeNode, SyntaxKind } from 'typescript';
import { isKind } from './utils';
import { AstNode } from './ast-node';

export class AstLiteralType implements AstNode {
  constructor(public node: LiteralTypeNode) {}

  get isString() {
    return !!isKind(this.node.literal, SyntaxKind.StringLiteral);
  }

  get isNumber() {
    return !!isKind(this.node.literal, SyntaxKind.NumericLiteral);
  }
}
