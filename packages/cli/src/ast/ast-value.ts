import { AstKeywordValue } from './ast-keyword-value';
import { AstLiteralValue } from './ast-literal-value';
import { AstCallExpression } from './ast-call-expression';
import { AstObjectValue } from './ast-object-value';
import { AstType } from './ast-type';
import { AstArrayValue } from './ast-array-value';
import { AstNewExpression } from './ast-new-expression';
import { AstPropertyAccessExpression } from './ast-property-access-expression';
import { AstVariableDeclaration } from './ast-variable-declaration';

export type AstValue =
  AstType
  | AstVariableDeclaration
  | AstCallExpression
  | AstPropertyAccessExpression
  | AstObjectValue
  | AstNewExpression
  | AstLiteralValue<any>
  | AstKeywordValue
  | AstArrayValue;

