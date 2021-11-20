import { getName, hasModifier, isSameType } from './utils';
import { AstEnumMember } from './ast-enum-member';
import { EnumDeclaration, factory, SyntaxKind } from 'typescript';
import { AstBlock } from './ast-block';
import { AstKeywordType } from './ast-keyword-type';
import { AstType } from './ast-type';
import { AstLiteralValue, AstNumericLiteralValue } from './ast-literal-value';
import { AstUnionType } from './ast-union-type';
import { AstNode } from './ast-node';

export class AstEnumDeclaration implements AstNode {
  constructor(private block: AstBlock, public node: EnumDeclaration) {}

  get name() {
    return getName(this.node.name, 'enum declaration');
  }

  get type() {
    const types: AstType[] = [];
    for (const member of this.members) {
      const memberType = member.type;
      if (memberType && !types.some((t) => isSameType(t, memberType))) {
        types.push(memberType);
      }
    }

    if (types.length === 0) {
      return new AstKeywordType(factory.createKeywordTypeNode(SyntaxKind.NumberKeyword));
    } else if (types.length > 1) {
      return new AstUnionType(this.block, factory.createUnionTypeNode([])); //TODO
    } else {
      return types[0];
    }
  }

  get exported(): boolean {
    return hasModifier(this.node.modifiers, SyntaxKind.ExportKeyword);
  }

  get members(): Generator<AstEnumMember> {
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
    let currentValue = 0;
    for (const member of this.node.members) {
      const enumMember = new AstEnumMember(this.block, member, currentValue);
      if (enumMember.value instanceof AstLiteralValue && enumMember.value instanceof AstNumericLiteralValue) {
        currentValue = enumMember.value.value + 1;
      }
      yield enumMember;
    }
  }
}
