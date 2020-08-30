import { AstContext } from './ast-context';
import * as path from 'path';

describe('ast-class-declaration', () => {
  const context = new AstContext();
  const sourceFile = context.get(path.join(__dirname, './ast-class-declaration.test.ts'));

  it('should parse TestClassDecl', () => {
    const testClassDecl = sourceFile!.block.class('TestClassDecl');
    expect(sourceFile).toBeDefined();
    expect(testClassDecl!.exported).toBeTruthy();
    expect(testClassDecl!.name).toBe('TestClassDecl');
  });

  it('should get extended class of TestClassDecl', () => {
    const testClassDecl = sourceFile!.block.class('TestClassDecl');
    expect(sourceFile).toBeDefined();
    expect(testClassDecl!.extends).toBeDefined();
    expect(testClassDecl!.extends!.name).toBe('TestClassDeclSuper');
  });

  it('should parse TestClassDecl', () => {
    const testClassDecl = sourceFile!.block.class('TestInteralClass');
    expect(sourceFile).toBeDefined();
    expect(testClassDecl!.exported).toBeFalsy();
    expect(testClassDecl!.name).toBe('TestInteralClass');
  });
});
