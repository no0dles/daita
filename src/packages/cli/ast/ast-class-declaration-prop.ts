import {
  getName,
  getTypeFromTypeOrExpression,
  getValueFromExpression,
  hasModifier,
} from './utils';
import { AstBlock } from './ast-block';
import { AstValue } from './ast-value';
import { PropertyDeclaration, SyntaxKind } from 'typescript';
import { AstType } from './ast-type';

export class AstClassDeclarationProp {
  constructor(private block: AstBlock, private node: PropertyDeclaration) {}

  get type(): AstType | null {
    return getTypeFromTypeOrExpression(
      this.block,
      this.node.type,
      this.node.initializer,
    );
  }

  get value(): AstValue | null {
    return getValueFromExpression(this.block, this.node.initializer);
  }

  get static(): boolean {
    return hasModifier(this.node.modifiers, SyntaxKind.StaticKeyword);
  }

  get canBeUndefined(): boolean {
    return this.node.questionToken !== undefined;
  }

  get name(): string {
    return getName(this.node.name, 'class declaration property');
  }
}
