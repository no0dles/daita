import { AstContext } from './ast-context';
import * as path from 'path';
import { AstTypeLiteralType } from './ast-type-literal-type';
import { AstKeywordType } from './ast-keyword-type';
import { isDefined } from '@daita/common';

describe('ast-type-literal-type', () => {
  const context = new AstContext();
  const sourceFile = context.get(path.join(__dirname, './ast-type-literal-type.test.ts'));

  it('should parse from variable', () => {
    isDefined(sourceFile);
    const variable = sourceFile.block.variable('variable');
    isDefined(variable);
    expect(variable.type).toBeInstanceOf(AstTypeLiteralType);
    const typeLiteralType = variable.type as AstTypeLiteralType;
    const testMember = typeLiteralType.member('test');
    isDefined(testMember);
    expect(testMember.type).toBeInstanceOf(AstKeywordType);
  });
});
