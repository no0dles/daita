import { AstContext } from './ast-context';
import * as path from 'path';
import { isDefined } from '@daita/common';

describe('ast-enum-declaration', () => {
  const context = new AstContext();
  const sourceFile = context.get(path.join(__dirname, './ast-enum-declaration.test.ts'));

  it('should parse exported enum', () => {
    isDefined(sourceFile);
    const enumValue = sourceFile.block.enum('NormalEnum');
    isDefined(enumValue);
    expect(enumValue).toBeDefined();
    expect(enumValue.exported).toBeTruthy();
    expect(enumValue.name).toBe('NormalEnum');
  });

  it('should parse internal enum', () => {
    isDefined(sourceFile);
    const enumValue = sourceFile.block.enum('InternalEnum');
    isDefined(enumValue);
    expect(enumValue.exported).toBeFalsy();
    expect(enumValue.name).toBe('InternalEnum');
  });
});
