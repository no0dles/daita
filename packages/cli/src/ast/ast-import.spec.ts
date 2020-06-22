import { MockAstContext } from './ast-context';

describe('ast-import', () => {
  it('should ignore node_modules', () => {
    const context = new MockAstContext();
    context.mock('schema.ts', `
    import {RelationalSchema} from '@daita/orm';
  `);
    const sourceFile = context.get('schema.ts');
    const imports = sourceFile?.getImports();
    expect(imports).not.toBeUndefined();
    expect(imports).not.toBeNull();
    expect(imports).toHaveLength(1);
    if (imports && imports[0]) {
      const exports = imports[0].getExported()
      expect(exports).not.toBeUndefined();
      expect(exports).not.toBeNull();
      expect(exports).toHaveLength(0);
    }
  });

  it('should import {}', () => {
    const context = new MockAstContext();
    context.mock('schema.ts', `
    import {User} from './user';
  `);
    context.mock('user.ts', `
    export class User {}
  `);
    const sourceFile = context.get('schema.ts');
    const imports = sourceFile?.getImports();
    expect(imports).not.toBeUndefined();
    expect(imports).not.toBeNull();
    expect(imports).toHaveLength(1);
    if (imports && imports[0]) {
      const exports = imports[0].getExported()
      expect(exports).not.toBeUndefined();
      expect(exports).not.toBeNull();
      expect(exports).toHaveLength(1);
      expect(exports[0].name).toBe('User');
    }
  });

  it('should import namespace', () => {
    const context = new MockAstContext();
    context.mock('schema.ts', `
    import * as user from './user';
  `);
    context.mock('user.ts', `
    export class User {}
  `);
    const sourceFile = context.get('schema.ts');
    const imports = sourceFile?.getImports();
    expect(imports).not.toBeUndefined();
    expect(imports).not.toBeNull();
    expect(imports).toHaveLength(1);
    if (imports && imports[0]) {
      const exports = imports[0].getExported()
      expect(exports).not.toBeUndefined();
      expect(exports).not.toBeNull();
      expect(exports).toHaveLength(1);
      expect(exports[0].name).toBe('User');
    }
  });

  it('should import renamed', () => {
    const context = new MockAstContext();
    context.mock('schema.ts', `
    import {User as User2} from './user';
  `);
    context.mock('user.ts', `
    export class User {}
  `);
    const sourceFile = context.get('schema.ts');
    const imports = sourceFile?.getImports();
    expect(imports).not.toBeUndefined();
    expect(imports).not.toBeNull();
    expect(imports).toHaveLength(1);
    if (imports && imports[0]) {
      const exports = imports[0].getExported();
      expect(exports).not.toBeUndefined();
      expect(exports).not.toBeNull();
      expect(exports).toHaveLength(1);
      expect(exports[0].name).toBe('User');
    }
    //TODO test variables
  });
});
