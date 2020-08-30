import { AstBlock } from './ast-block';
import { SyntaxKind, TypeLiteralNode } from 'typescript';
import { isKind } from '../ast/utils';
import { AstPropertySignature } from './ast-property-signature';
import { AstNode } from './ast-node';

export class AstTypeLiteralType implements AstNode {
  constructor(private block: AstBlock, public node: TypeLiteralNode) {}

  get members() {
    return this.getMembers();
  }

  member(name: string) {
    for (const member of this.members) {
      if (member.name === name) {
        return member;
      }
    }
    return null;
  }

  private *getMembers() {
    for (const member of this.node.members) {
      const propertySignature = isKind(member, SyntaxKind.PropertySignature);
      if (propertySignature) {
        yield new AstPropertySignature(this.block, propertySignature);
      }
    }
  }
}
