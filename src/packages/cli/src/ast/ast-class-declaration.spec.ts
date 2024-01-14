import { AstContext } from './ast-context';
import * as path from 'path';
import { isDefined } from '@daita/common';

describe('ast-class-declaration', () => {
  const context = new AstContext();
  const sourceFile = context.get(path.join(__dirname, './ast-class-declaration.test.ts'));
  isDefined(sourceFile);

  it('should parse TestClassDecl', () => {
    const testClassDecl = sourceFile.block.class('TestClassDecl');
    isDefined(testClassDecl);
    expect(testClassDecl.exported).toBeTruthy();
    expect(testClassDecl.name).toBe('TestClassDecl');
  });

  it('should get extended class of TestClassDecl', () => {
    const testClassDecl = sourceFile.block.class('TestClassDecl');
    isDefined(testClassDecl);
    isDefined(testClassDecl.extends);
    expect(testClassDecl.extends.name).toBe('TestClassDeclSuper');
  });

  it('should parse TestClassDecl', () => {
    const testClassDecl = sourceFile.block.class('TestInteralClass');
    isDefined(testClassDecl);
    expect(testClassDecl.exported).toBeFalsy();
    expect(testClassDecl.name).toBe('TestInteralClass');
  });
});
