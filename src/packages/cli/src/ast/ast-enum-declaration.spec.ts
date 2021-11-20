import { AstContext } from './ast-context';
import * as path from 'path';

describe('ast-enum-declaration', () => {
  const context = new AstContext();
  const sourceFile = context.get(
    path.join(__dirname, './ast-enum-declaration.test.ts'),
  );

  it('should parse exported enum', () => {
    const enumValue = sourceFile!.block.enum('NormalEnum');
    expect(enumValue).toBeDefined();
    expect(enumValue!.exported).toBeTruthy();
    expect(enumValue!.name).toBe('NormalEnum');
  });

  it('should parse internal enum', () => {
    const enumValue = sourceFile!.block.enum('InternalEnum');
    expect(enumValue).toBeDefined();
    expect(enumValue!.exported).toBeFalsy();
    expect(enumValue!.name).toBe('InternalEnum');
  });
});
