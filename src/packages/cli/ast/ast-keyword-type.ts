import { KeywordTypeNode, SyntaxKind } from 'typescript';
import { AstNode } from './ast-node';

export class AstKeywordType implements AstNode {
  constructor(public node: KeywordTypeNode) {
  }

  equals(type: AstKeywordType) {
    return this.node.kind === type.node.kind;
  }

  get isString() {
    return this.node.kind === SyntaxKind.StringKeyword;
  }

  get isBoolean() {
    return this.node.kind === SyntaxKind.BooleanKeyword;
  }

  get isNumber() {
    return this.node.kind === SyntaxKind.NumberKeyword;
  }

  get isUndefined() {
    return this.node.kind === SyntaxKind.UndefinedKeyword;
  }

  get isNull() {
    return this.node.kind === SyntaxKind.NullKeyword;
  }
}
