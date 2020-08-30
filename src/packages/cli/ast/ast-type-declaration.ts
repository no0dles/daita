import { getName, getType, hasModifier } from './utils';
import { AstBlock } from './ast-block';
import { SyntaxKind, TypeAliasDeclaration } from 'typescript';
import { AstType } from './ast-type';
import { AstNode } from './ast-node';

export class AstTypeDeclaration implements AstNode {
  constructor(private block: AstBlock,
              public node: TypeAliasDeclaration) {
  }

  get name(): string {
    return getName(this.node.name, 'type declaration');
  }

  get exported(): boolean {
    return hasModifier(this.node.modifiers, SyntaxKind.ExportKeyword);
  }

  get type(): AstType | null {
    return getType(this.block, this.node.type);
  }
}
