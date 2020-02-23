import {AstClassDeclaration} from '../../ast/ast-class-declaration';

export interface SchemaTable {
  classDeclaration: AstClassDeclaration;
  options: { key: string[] };
}
