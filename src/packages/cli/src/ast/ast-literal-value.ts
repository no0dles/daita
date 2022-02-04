import { BooleanLiteral, NumericLiteral, StringLiteral, SyntaxKind, Node, factory } from 'typescript';
import { AstKeywordType } from './ast-keyword-type';
import { AstNode } from './ast-node';
import { failNever } from '@daita/common';

export abstract class AstLiteralValue<T> implements AstNode {
  abstract get type(): AstKeywordType;

  abstract get value(): T;

  abstract node: Node;
}

export class AstStringLiteralValue extends AstLiteralValue<string> implements AstNode {
  constructor(public node: StringLiteral) {
    super();
  }

  get type() {
    return new AstKeywordType(factory.createKeywordTypeNode(SyntaxKind.StringKeyword));
  }

  get value() {
    return this.node.text;
  }
}

export class AstBooleanLiteralValue extends AstLiteralValue<boolean> implements AstNode {
  constructor(public node: BooleanLiteral) {
    super();
  }

  get type() {
    return new AstKeywordType(factory.createKeywordTypeNode(SyntaxKind.BooleanKeyword));
  }

  get value() {
    if (this.node.kind === SyntaxKind.TrueKeyword) {
      return true;
    }
    if (this.node.kind === SyntaxKind.FalseKeyword) {
      return false;
    }
    failNever(this.node, 'unknown kind');
  }
}

export class AstNumericLiteralValue extends AstLiteralValue<number> implements AstNode {
  constructor(public node: NumericLiteral) {
    super();
  }

  get type() {
    return new AstKeywordType(factory.createKeywordTypeNode(SyntaxKind.NumberKeyword));
  }

  get value() {
    return parseFloat(this.node.text);
  }
}
