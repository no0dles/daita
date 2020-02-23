import {MockAstContext} from './ast-context';
import {isNotNull} from '../test/utils';

describe('ast-source-file', () => {
  describe('variable', () => {
    it('should get single constant', () => {
      const context = new MockAstContext();
      context.mock('test.ts', `
      const foo = {};
    `);
      const sourceFile = context.get('test.ts');
      isNotNull(sourceFile);
      const variable = sourceFile.getVariable('foo');
      isNotNull(variable);
      expect(variable.name).toEqual('foo');
      expect(variable.exported).toEqual(false);
    });

    it('should parse multi variable declaration', () => {
      const context = new MockAstContext();
      context.mock('test.ts', `
      const foo = {}, bar = {};
    `);
      const sourceFile = context.get('test.ts');
      isNotNull(sourceFile);
      const fooVariable = sourceFile.getVariable('foo');
      isNotNull(fooVariable);
      expect(fooVariable.exported).toEqual(false);
      const barVariable = sourceFile.getVariable('bar');
      isNotNull(barVariable);
      expect(barVariable.exported).toEqual(false);
    });

    it('should parse exported variable', () => {
      const context = new MockAstContext();
      context.mock('test.ts', `
      export const foo = {};
    `);
      const sourceFile = context.get('test.ts');
      isNotNull(sourceFile);
      const fooVariable = sourceFile.getVariable('foo');
      isNotNull(fooVariable);
      expect(fooVariable.exported).toEqual(true);
    });
  });
});