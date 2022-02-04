import { AstKeywordType } from './ast-keyword-type';
import { AstReferenceType } from './ast-reference-type';
import { AstTypeLiteralType } from './ast-type-literal-type';
import { AstUnionType } from './ast-union-type';
import { AstContext } from './ast-context';
import * as path from 'path';
import { isDefined } from '@daita/common';

describe('ast-class-declaration-prop', () => {
  const context = new AstContext();
  const sourceFile = context.get(path.join(__dirname, './ast-class-declaration-prop.test.ts'));
  isDefined(sourceFile);
  const testClassDecl = sourceFile.block.class('TestClassDecl');
  isDefined(testClassDecl);

  it('should parse TestClassDecl.prop1', () => {
    const testClassDeclProp = testClassDecl.prop('prop1');
    isDefined(testClassDeclProp);
    expect(testClassDeclProp.name).toBe('prop1');
    expect(testClassDeclProp.static).toBeFalsy();
    expect(testClassDeclProp.canBeUndefined).toBeFalsy();
    expect(testClassDeclProp.value).toBeNull();
    expect(testClassDeclProp.type).toBeInstanceOf(AstKeywordType);
  });

  it('should parse TestClassDecl.prop2', () => {
    const testClassDeclProp = testClassDecl.prop('prop2');
    isDefined(testClassDeclProp);
    expect(testClassDeclProp.name).toBe('prop2');
    expect(testClassDeclProp.static).toBeFalsy();
    expect(testClassDeclProp.value).toBeNull();
    expect(testClassDeclProp.canBeUndefined).toBeFalsy();
    expect(testClassDeclProp.type).toBeInstanceOf(AstKeywordType);
  });

  it('should parse TestClassDecl.prop3', () => {
    const testClassDeclProp = testClassDecl.prop('prop3');
    isDefined(testClassDeclProp);
    expect(testClassDeclProp.name).toBe('prop3');
    expect(testClassDeclProp.static).toBeFalsy();
    expect(testClassDeclProp.value).toBeNull();
    expect(testClassDeclProp.canBeUndefined).toBeFalsy();
    expect(testClassDeclProp.type).toBeInstanceOf(AstKeywordType);
  });

  it('should parse TestClassDecl.prop4', () => {
    const testClassDeclProp = testClassDecl.prop('prop4');
    isDefined(testClassDeclProp);
    expect(testClassDeclProp.name).toBe('prop4');
    expect(testClassDeclProp.static).toBeFalsy();
    expect(testClassDeclProp.value).toBeNull();
    expect(testClassDeclProp.canBeUndefined).toBeFalsy();
    expect(testClassDeclProp.type).toBeInstanceOf(AstReferenceType);
  });

  it('should parse TestClassDecl.prop5', () => {
    const testClassDeclProp = testClassDecl.prop('prop5');
    isDefined(testClassDeclProp);
    expect(testClassDeclProp.name).toBe('prop5');
    expect(testClassDeclProp.static).toBeFalsy();
    expect(testClassDeclProp.value).toBeNull();
    expect(testClassDeclProp.canBeUndefined).toBeFalsy();
    expect(testClassDeclProp.type).toBeInstanceOf(AstTypeLiteralType);
  });

  it('should parse TestClassDecl.prop6', () => {
    const testClassDeclProp = testClassDecl.prop('prop6');
    isDefined(testClassDeclProp);
    expect(testClassDeclProp.name).toBe('prop6');
    expect(testClassDeclProp.static).toBeFalsy();
    expect(testClassDeclProp.value).toBeNull();
    expect(testClassDeclProp.canBeUndefined).toBeTruthy();
    expect(testClassDeclProp.type).toBeInstanceOf(AstKeywordType);
  });

  it('should parse TestClassDecl.prop7', () => {
    const testClassDeclProp = testClassDecl.prop('prop7');
    isDefined(testClassDeclProp);
    expect(testClassDeclProp.name).toBe('prop7');
    expect(testClassDeclProp.static).toBeFalsy();
    expect(testClassDeclProp.value).toBeNull();
    expect(testClassDeclProp.canBeUndefined).toBeFalsy();
    expect(testClassDeclProp.type).toBeInstanceOf(AstUnionType);
  });
});
