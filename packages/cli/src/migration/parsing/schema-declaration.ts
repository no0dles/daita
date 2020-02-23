import {AstVariable} from '../../ast/ast-variable';

export interface SchemaDeclaration {
  variable: AstVariable;
  type: 'relational' | 'document';
}