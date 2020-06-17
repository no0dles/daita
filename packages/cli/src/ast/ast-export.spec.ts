import { MockAstContext } from './ast-context';

describe('ast-export', () => {
  it('should get default export', () => {
    const context = new MockAstContext();
    context.mock('schema.ts', `
    import {RelationalSchema} from '@daita/orm';
    const schema = new RelationalSchema();
    export = schema;
  `);
    const sourceFile = context.get('schema.ts');
    const exports = sourceFile?.getExports();
    expect(exports).not.toBeUndefined();
    expect(exports).not.toBeNull();
    expect(exports).toHaveLength(1);
    if (exports && exports[0]) {
      expect(exports[0]?.name).toBe('schema');
    }
  });

  it('should get exported classes', () => {
    const context = new MockAstContext();
    context.mock('user.ts', `
    export class User {
    }
    export class UserRole {
    }
  `);
    const sourceFile = context.get('user.ts');
    const exports = sourceFile?.getExports();
    expect(exports).not.toBeUndefined();
    expect(exports).not.toBeNull();
    expect(exports).toHaveLength(2);
    if (exports && exports[0]) {
      expect(exports[0].name).toBe('User');
      expect(exports[1].name).toBe('UserRole');
    }
  });

  it('should get export *', () => {
    const context = new MockAstContext();
    context.mock('user.ts', `
    export class User {
    }
  `);
    context.mock('index.ts', `
    export * from './user';
  `);
    const sourceFile = context.get('index.ts');
    const exports = sourceFile?.getExports();
    expect(exports).not.toBeUndefined();
    expect(exports).not.toBeNull();
    expect(exports).toHaveLength(1);
    if (exports && exports[0]) {
      expect(exports[0].name).toBe('User');
    }
  });
});
