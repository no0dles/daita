import { AstContext } from './ast-context';
import * as path from 'path';
import { AstRegularExpressionLiteral } from './ast-regular-expression-literal';
import { isDefined } from '@daita/common';

describe('cli/ast-regular-expression-literal', () => {
  const context = new AstContext();
  const sourceFile = context.get(path.join(__dirname, './ast-regular-expression-literal.test.ts'));

  it('should parse regex value', () => {
    isDefined(sourceFile);
    const variable = sourceFile.block.variable('varRegex');
    isDefined(variable);
    const value = variable.value;
    expect(value).toBeInstanceOf(AstRegularExpressionLiteral);
    const regularLiteral = value as AstRegularExpressionLiteral;
    expect(regularLiteral.regexp).toStrictEqual(/[a-z]+/);
  });
});
