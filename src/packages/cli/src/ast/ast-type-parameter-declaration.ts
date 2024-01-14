import { AstBlock } from './ast-block';
import { TypeParameterDeclaration } from 'typescript';

export class AstTypeParameterDeclaration {
  constructor(private block: AstBlock, private node: TypeParameterDeclaration) {}
}
