import { AstContext } from '../../ast/ast-context';
import path from 'path';
import { isDefined } from '@daita/testing';
import { parseSchemaMigrations } from './parse-schema-migrations';

describe('cli/parse-schema-migrations', () => {
  it('should parse migration', () => {
    const context = new AstContext();
    const sourceFile = context.get(path.join(__dirname, './parse-schema-migrations.test.ts'));
    isDefined(sourceFile);
    const schemaVariable = sourceFile.block.variable('schema');
    isDefined(schemaVariable);
    const migratedTree = parseSchemaMigrations(schemaVariable);
    const rootMigrations = migratedTree.roots();
    expect(rootMigrations).toHaveLength(1);
    expect(rootMigrations[0].id).toBe('Test');
    expect(rootMigrations[0].upMigration).toHaveLength(2);
    expect(rootMigrations[0].downMigration).toHaveLength(1);
    expect(rootMigrations[0].upMigration).toEqual([
      {
        createTable: { table: 'User' },
        columns: [],
      },
      {
        insert: {},
        into: { table: 'User' },
      },
    ]);
    expect(rootMigrations[0].downMigration).toEqual([
      {
        dropTable: { table: 'User' },
      },
    ]);
  });
});
