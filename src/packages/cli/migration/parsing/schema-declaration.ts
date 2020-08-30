import { AstVariableDeclaration } from '../../ast/ast-variable-declaration';

export interface SchemaDeclaration {
  variable: AstVariableDeclaration;
  type: 'relational' | 'document';
}
