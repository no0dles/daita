import {MockAstContext} from './ast-context';
import {isNotNull} from '../test/utils';

describe('ast-class-declaration', () => {
  const context = new MockAstContext();
  context.mock('schema.ts', `
    import {RelationalSchema} from '@daita/orm';
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
    expect(classDeclaration.exported).toEqual(true);
    const property = classDeclaration.getProperty('foo');
    isNotNull(property);
    expect(property.name).toEqual('foo');
    isNotNull(property.type);

    expect(property.type.kind).toEqual('string');
    expect(property.type.allowUndefined).toEqual(false);
  });

  it('should return extended properties', () => {
    const sourceFile = context.get('user.ts');
    isNotNull(sourceFile);
    const classDeclaration = sourceFile.getClassDeclaration('User');
    isNotNull(classDeclaration);
    expect(classDeclaration.exported).toEqual(true);
    const property = classDeclaration.getProperty('modifiedDate', {includedInherited: true});
    isNotNull(property);
    expect(property.name).toEqual('modifiedDate');
    isNotNull(property.type);

    expect(property.type.kind).toEqual('reference');
    expect(property.type.allowUndefined).toEqual(false);
  });

  it('should not be exported', () => {
    const sourceFile = context.get('internal.ts');
    isNotNull(sourceFile);
    const classDeclaration = sourceFile.getClassDeclaration('InternalCls');
    isNotNull(classDeclaration);
    expect(classDeclaration.exported).toEqual(false);
  })
});
