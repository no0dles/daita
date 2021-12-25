import { AstContext } from './ast-context';
import * as path from 'path';
import { AstTypeLiteralType } from './ast-type-literal-type';
import { AstKeywordType } from './ast-keyword-type';

describe('ast-type-literal-type', () => {
  const context = new AstContext();
  const sourceFile = context.get(path.join(__dirname, './ast-type-literal-type.test.ts'));

  it('should parse from variable', () => {
    const variable = sourceFile!.block.variable('variable');
    expect(variable).toBeDefined();
    expect(variable!.type).toBeInstanceOf(AstTypeLiteralType);
    const typeLiteralType = variable!.type as AstTypeLiteralType;
    const testMember = typeLiteralType.member('test');
    expect(testMember).toBeDefined();
    expect(testMember!.type).toBeInstanceOf(AstKeywordType);
  });
});
