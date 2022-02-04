import { AstContext } from './ast-context';
import * as path from 'path';
import { AstLiteralValue } from './ast-literal-value';
import { isDefined } from '@daita/common';

describe('ast-enum-member', () => {
  const context = new AstContext();
  const sourceFile = context.get(path.join(__dirname, './ast-enum-member.test.ts'));

  it('should parse enum without specified values', () => {
    isDefined(sourceFile);
    const enumValue = sourceFile.block.enum('NormalEnum');
    isDefined(enumValue);
    const enumMember = enumValue.member('First');
    isDefined(enumMember);
    expect(enumMember.value).toBeDefined();
    expect(enumMember.value).toBeInstanceOf(AstLiteralValue);
  });
});
