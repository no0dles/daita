import { KeywordTypeNode, SyntaxKind } from 'typescript';
import { AstNode } from './ast-node';
import { AstError } from './utils';

export class AstKeywordValue implements AstNode {
  constructor(public node: KeywordTypeNode) {
  }

  get value() {
    if (this.node.kind === SyntaxKind.NullKeyword) {
      return null;
    } else if (this.node.kind === SyntaxKind.UndefinedKeyword) {
      return undefined;
    } else {
      throw new AstError(this.node, 'unknown value');
    }
  }
}
