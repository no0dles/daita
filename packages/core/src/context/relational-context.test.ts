import {MigrationDescription} from '../migration';
import {RelationalSchema} from '../schema';
import {RelationalDataAdapter} from '../adapter';
import {RelationalDataAdapterFactory, RelationalDataAdapterFactoryResult} from '../test/test-utils';
import {RelationalMigrationAdapter} from '../adapter/relational-migration-adapter';

export function relationalContextTest(adapterFactory: RelationalDataAdapterFactory<RelationalMigrationAdapter>) {
  describe('relational-context', () => {
    let result: RelationalDataAdapterFactoryResult<any>;
    let dataAdapter: RelationalMigrationAdapter;

    beforeEach(async () => {
      result = await adapterFactory.create(new RelationalSchema());
      dataAdapter = result.dataAdapter;
    });

    afterEach(async () => {
      if (result) {
        await result.close();
      }
    });

    it('migration apply empty schema', async () => {
      await applyMigrations(dataAdapter, []);
      await expectTables(dataAdapter, 'daita', {migrations: ['id']});
    });

    it('migration apply schema with table create', async () => {
      const Migration: MigrationDescription = {
        id: 'test',
        steps: [
          {kind: 'add_table', table: 'foo'},
          {kind: 'add_table_field', table: 'foo', fieldName: 'bar', type: 'number', required: true},
          {kind: 'add_table_primary_key', table: 'foo', fieldNames: ['bar']},
        ],
      };

      await applyMigrations(dataAdapter, [Migration]);
      await expectTables(dataAdapter, 'daita', {
        migrations: ['id'],
      });
      await expectTables(dataAdapter, 'public', {
        foo_test: ['bar_test'],
      });
    });

    it('migration apply schema with two table create', async () => {
      const FirstMigration: MigrationDescription = {
        id: 'test',
        steps: [
          {kind: 'add_table', table: 'foo'},
          {kind: 'add_table_field', table: 'foo', fieldName: 'bar', type: 'number', required: true},
          {kind: 'add_table_primary_key', table: 'foo', fieldNames: ['bar']},
        ],
      };
      const SecondMigration: MigrationDescription = {
        id: 'test2',
        steps: [
          {kind: 'add_table', table: 'bar'},
          {kind: 'add_table_field', table: 'bar', fieldName: 'foo', type: 'number', required: true},
          {kind: 'add_table_primary_key', table: 'bar', fieldNames: ['foo']},
        ],
        after: 'test',
      };

      await applyMigrations(dataAdapter, [FirstMigration, SecondMigration]);
      await expectTables(dataAdapter, 'daita', {
        migrations: ['id'],
      });
      await expectTables(dataAdapter, 'public', {
        foo_test: ['bar_test'],
        bar_test2: ['foo_test2'],
      });
    });

    it('migration apply schema with relational table', async () => {
      const FirstMigration: MigrationDescription = {
        id: 'test',
        steps: [
          {kind: 'add_table', table: 'role'},
          {kind: 'add_table_field', table: 'role', fieldName: 'id', type: 'number', required: true},
          {kind: 'add_table_primary_key', table: 'role', fieldNames: ['id']},
          {kind: 'add_table', table: 'user'},
          {kind: 'add_table_field', table: 'user', fieldName: 'name', type: 'string', required: true},
          {kind: 'add_table_field', table: 'user', fieldName: 'roleId', type: 'number', required: true},
          {kind: 'add_table_primary_key', table: 'user', fieldNames: ['name']},
          {
            kind: 'add_table_foreign_key',
            table: 'user',
            name: 'role',
            fieldNames: ['roleId'],
            foreignTable: 'role',
            foreignFieldNames: ['id'],
            required: true,
          },
        ],
      };

      await applyMigrations(dataAdapter, [FirstMigration]);
      await expectTables(dataAdapter, 'daita', {
        migrations: ['id'],
      });
      await expectTables(dataAdapter, 'public', {
        role_test: ['id_test'],
        user_test: ['name_test', 'roleId_test'],
      });
    });

    it('should accept later reference', async () => {
      const FirstMigration: MigrationDescription = {
        id: 'test',
        steps: [
          {kind: 'add_table', table: 'role'},
          {kind: 'add_table_field', table: 'role', fieldName: 'id', type: 'number', required: true},
          {kind: 'add_table_primary_key', table: 'role', fieldNames: ['id']},
          {kind: 'add_table', table: 'user'},
          {kind: 'add_table_field', table: 'user', fieldName: 'name', type: 'string', required: true},
          {kind: 'add_table_field', table: 'user', fieldName: 'roleId', type: 'number', required: true},
          {kind: 'add_table_primary_key', table: 'user', fieldNames: ['name']},
        ],
      };

      const SecondMigration: MigrationDescription = {
        id: 'test2',
        steps: [
          {
            kind: 'add_table_foreign_key',
            table: 'user',
            name: 'role',
            fieldNames: ['roleId'],
            foreignTable: 'role',
            foreignFieldNames: ['id'],
            required: true,
          },
        ],
        after: 'test',
      };

      await applyMigrations(dataAdapter, [FirstMigration, SecondMigration]);
      await expectTables(dataAdapter, 'daita', {
        migrations: ['id'],
      });
      await expectTables(dataAdapter, 'public', {
        role_test: ['id_test'],
        user_test: ['name_test', 'roleId_test'],
      });
    });

    it('should accept reference in second migration', async () => {
      const FirstMigration: MigrationDescription = {
        id: 'test',
        steps: [

          {kind: 'add_table', table: 'role'},
          {kind: 'add_table_field', table: 'role', fieldName: 'id', type: 'number', required: true},
          {kind: 'add_table_primary_key', table: 'role', fieldNames: ['id']},
          {kind: 'add_table', table: 'user'},
          {kind: 'add_table_field', table: 'user', fieldName: 'name', type: 'string', required: true},
          {kind: 'add_table_primary_key', table: 'user', fieldNames: ['name']},
        ],
      };

      const SecondMigration: MigrationDescription = {
        id: 'test2',
        steps: [
          {kind: 'add_table_field', table: 'user', fieldName: 'roleId', type: 'number', required: true},
          {
            kind: 'add_table_foreign_key',
            table: 'user',
            name: 'role',
            fieldNames: ['roleId'],
            foreignTable: 'role',
            foreignFieldNames: ['id'],
            required: true,
          },
        ],
        after: 'test',
      };

      await applyMigrations(dataAdapter, [FirstMigration, SecondMigration]);
      await expectTables(dataAdapter, 'daita', {
        migrations: ['id'],
      });
      await expectTables(dataAdapter, 'public', {
        role_test: ['id_test'],
        user_test: ['name_test', 'roleId_test2'],
      });
    });
  });
}

async function applyMigrations(
  dataAdapter: RelationalMigrationAdapter,
  migrations: MigrationDescription[],
) {
  const schema = new RelationalSchema();
  for (const migration of migrations) {
    schema.migration(migration);
  }
  const context = schema.context(dataAdapter);
  await context.applyMigrations();
}

async function getTables(dataAdapter: RelationalDataAdapter, schema: string) {
  const res = await dataAdapter.raw(
    `SELECT table_name, column_name FROM information_schema.columns WHERE table_schema = '${schema}';`,
    [],
  );
  const tables: Tables = {};
  for (const row of res.rows) {
    if (!tables[row.table_name]) {
      tables[row.table_name] = [];
    }
    tables[row.table_name].push(row.column_name);
  }
  return tables;
}

interface Tables {
  [key: string]: string[];
}

async function expectTables(
  dataAdapter: RelationalDataAdapter,
  schema: string,
  expectedTables: Tables,
) {
  const actualTables = await getTables(dataAdapter, schema);

  for (const key of Object.keys(actualTables)) {
    actualTables[key].sort();
  }

  for (const key of Object.keys(expectedTables)) {
    expectedTables[key].sort();
  }

  expect(actualTables).toEqual(expectedTables);
}
