import { getName, getType } from './utils';
import { AstBlock } from './ast-block';
import { ParameterDeclaration } from 'typescript';
import { AstType } from './ast-type';

export class AstParameterDeclaration {
  constructor(private block: AstBlock, private node: ParameterDeclaration) {}

  get type(): AstType | null {
    return getType(this.block, this.node.type);
  }

  get name(): string {
    return getName(this.node.name, 'method declaration parameter');
  }
}
