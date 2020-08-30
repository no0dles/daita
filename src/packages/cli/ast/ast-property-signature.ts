import { AstBlock } from './ast-block';
import { getName, getType } from './utils';
import { PropertySignature } from 'typescript';

export class AstPropertySignature {
  constructor(private block: AstBlock,
              private node: PropertySignature) {
  }

  get canBeUndefined(): boolean {
    return this.node.questionToken !== undefined;
  }

  get name() {
    return getName(this.node.name, 'property signature');
  }

  get type() {
    return getType(this.block, this.node.type);
  }
}
