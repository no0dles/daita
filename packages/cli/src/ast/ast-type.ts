import { AstUnionType } from './ast-union-type';
import { AstArrayType } from './ast-array-type';
import { AstReferenceType } from './ast-reference-type';
import { AstLiteralType } from './ast-literal-type';
import { AstTypeLiteralType } from './ast-type-literal-type';
import { AstKeywordType } from './ast-keyword-type';
import { AstClassDeclaration } from './ast-class-declaration';
import { AstEnumDeclaration } from './ast-enum-declaration';
import { AstMethodDeclaration } from './ast-method-declaration';
import { AstFunctionDeclaration } from './ast-function-declaration';

export type AstType =
  AstClassDeclaration
  | AstEnumDeclaration
  | AstMethodDeclaration
  | AstFunctionDeclaration
  | AstLiteralType
  | AstReferenceType
  | AstTypeLiteralType
  | AstArrayType
  | AstKeywordType
  | AstUnionType;
