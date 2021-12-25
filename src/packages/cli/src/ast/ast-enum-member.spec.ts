import { AstContext } from './ast-context';
import * as path from 'path';
import { AstLiteralValue } from './ast-literal-value';

describe('ast-enum-member', () => {
  const context = new AstContext();
  const sourceFile = context.get(path.join(__dirname, './ast-enum-member.test.ts'));

  it('should parse enum without specified values', () => {
    const enumValue = sourceFile!.block.enum('NormalEnum');
    expect(enumValue).toBeDefined();
    const enumMember = enumValue!.member('First');
    expect(enumMember).toBeDefined();
    expect(enumMember!.value).toBeDefined();
    expect(enumMember!.value).toBeInstanceOf(AstLiteralValue);
  });
});
