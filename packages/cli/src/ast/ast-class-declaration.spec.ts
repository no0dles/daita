import {MockAstContext} from './ast-context';
import {expect} from 'chai';
import {isNotNull} from '../test/utils';

describe('ast-class-declaration', () => {
  const context = new MockAstContext();
  context.mock('schema.ts', `
    import {RelationalSchema} from '@daita/core';
    import {User} from './user';
    const schema = new RelationalSchema();
    schema.table(User);
    export = schema;
  `);
  context.mock('base.ts', `
    export class Base {
      modifiedUser: string;
      modifiedDate: Date;
    }
  `);
  context.mock('user.ts', `
    import {Base} from './base';
    export class User extends Base {
      foo: string;
    }
  `);
  context.mock('internal.ts', `
    class InternalCls {
      bar: number;
    }
  `);

  it('should return own properties', () => {
    const sourceFile = context.get('user.ts');
    isNotNull(sourceFile);
    const classDeclaration = sourceFile.getClassDeclaration('User');
    isNotNull(classDeclaration);
    expect(classDeclaration.exported).to.be.eq(true);
    const property = classDeclaration.getProperty('foo');
    isNotNull(property);
    expect(property.name).to.be.eq('foo');
    isNotNull(property.type);

    expect(property.type.kind).to.be.deep.eq('string');
    expect(property.type.allowUndefined).to.be.eq(false);
  });

  it('should return extended properties', () => {
    const sourceFile = context.get('user.ts');
    isNotNull(sourceFile);
    const classDeclaration = sourceFile.getClassDeclaration('User');
    isNotNull(classDeclaration);
    expect(classDeclaration.exported).to.be.eq(true);
    const property = classDeclaration.getProperty('modifiedDate', {includedInherited: true});
    isNotNull(property);
    expect(property.name).to.be.eq('modifiedDate');
    isNotNull(property.type);

    expect(property.type.kind).to.be.deep.eq('reference');
    expect(property.type.allowUndefined).to.be.eq(false);
  });

  it('should not be exported', () => {
    const sourceFile = context.get('internal.ts');
    isNotNull(sourceFile);
    const classDeclaration = sourceFile.getClassDeclaration('InternalCls');
    isNotNull(classDeclaration);
    expect(classDeclaration.exported).to.be.eq(false);
  })
});