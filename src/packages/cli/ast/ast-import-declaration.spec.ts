import * as path from 'path';
import { AstFunctionDeclaration } from './ast-function-declaration';
import { AstContext } from './ast-context';

describe('ast-import-declaration', () => {
  const context = new AstContext();
  const sourceFile = context.get(path.join(__dirname, './ast-import-declaration.test.ts'));

  it('should parse imported function declaration', async () => {
    expect(sourceFile).toBeDefined();
    const namedImport = sourceFile!.imports.next().value;
    const authorizedFn = namedImport.getType('authorized') as AstFunctionDeclaration;
    expect(authorizedFn).toBeDefined();
    expect(authorizedFn).toBeInstanceOf(AstFunctionDeclaration);
    expect(authorizedFn.name).toBe('authorized');
    expect(authorizedFn.exported).toBe(true);
  });
});
