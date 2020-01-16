import { PostgresDataAdapter } from '@daita/core/dist/postgres';
import { dropDatabase } from '@daita/core/dist/postgres/postgres.util';
import { DefaultConstructable } from '@daita/core/dist/constructable';
import {
  MigrationDescription,
  RelationalAddTableFieldMigrationStep,
  RelationalAddTableForeignKey,
  RelationalAddTableMigrationStep,
  RelationalAddTablePrimaryKey,
  RelationalDataAdapter,
  RelationalSchema,
} from '@daita/core';
import { expect } from 'chai';

const postgresUri = process.env.POSTGRES_URI || 'postgres://postgres:postgres@localhost';

describe('relational-context', () => {
  const connectionString = `${postgresUri}/daita-test`;
  let dataAdapter: PostgresDataAdapter;

  beforeEach(async () => {
    await dropDatabase(connectionString);
    dataAdapter = new PostgresDataAdapter(connectionString);
  });

  afterEach(async () => {
    if (dataAdapter) {
      await dataAdapter.close();
    }
  });

  it('migration apply empty schema', async () => {
    await applyMigrations(dataAdapter, []);
    await expectTables(dataAdapter, 'public', { migrations: ['id'] });
  });

  it('migration apply schema with table create', async () => {
    class Migration implements MigrationDescription {
      id = 'test';
      steps = [
        new RelationalAddTableMigrationStep('foo'),
        new RelationalAddTableFieldMigrationStep('foo', 'bar', 'number'),
        new RelationalAddTablePrimaryKey('foo', ['bar']),
      ];
    }

    await applyMigrations(dataAdapter, [Migration]);
    await expectTables(dataAdapter, 'public', {
      migrations: ['id'],
      test_foo: ['test_bar'],
    });
  });

  it('migration apply schema with two table create', async () => {
    class FirstMigration implements MigrationDescription {
      id = 'test';
      steps = [
        new RelationalAddTableMigrationStep('foo'),
        new RelationalAddTableFieldMigrationStep('foo', 'bar', 'number'),
        new RelationalAddTablePrimaryKey('foo', ['bar']),
      ];
    }
    class SecondMigration implements MigrationDescription {
      id = 'test2';
      steps = [
        new RelationalAddTableMigrationStep('bar'),
        new RelationalAddTableFieldMigrationStep('bar', 'foo', 'string'),
        new RelationalAddTablePrimaryKey('bar', ['foo']),
      ];
      after = 'test';
    }

    await applyMigrations(dataAdapter, [FirstMigration, SecondMigration]);
    await expectTables(dataAdapter, 'public', {
      migrations: ['id'],
      test_foo: ['test_bar'],
      test2_bar: ['test2_foo'],
    });
  });

  it('migration apply schema with relational table', async () => {
    class FirstMigration implements MigrationDescription {
      id = 'test';
      steps = [
        new RelationalAddTableMigrationStep('role'),
        new RelationalAddTableFieldMigrationStep('role', 'id', 'number'),
        new RelationalAddTablePrimaryKey('role', ['id']),
        new RelationalAddTableMigrationStep('user'),
        new RelationalAddTableFieldMigrationStep('user', 'name', 'string'),
        new RelationalAddTableFieldMigrationStep('user', 'roleId', 'number'),
        new RelationalAddTablePrimaryKey('user', ['name']),
        new RelationalAddTableForeignKey('user', 'role', ['roleId'], 'role', [
          'id',
        ]),
      ];
    }

    await applyMigrations(dataAdapter, [FirstMigration]);
    await expectTables(dataAdapter, 'public', {
      migrations: ['id'],
      test_role: ['test_id'],
      test_user: ['test_name', 'test_roleId'],
    });
  });

  it('should accept later reference', async () => {
    class FirstMigration implements MigrationDescription {
      id = 'test';
      steps = [
        new RelationalAddTableMigrationStep('role'),
        new RelationalAddTableFieldMigrationStep('role', 'id', 'number'),
        new RelationalAddTablePrimaryKey('role', ['id']),
        new RelationalAddTableMigrationStep('user'),
        new RelationalAddTableFieldMigrationStep('user', 'name', 'string'),
        new RelationalAddTableFieldMigrationStep('user', 'roleId', 'number'),
        new RelationalAddTablePrimaryKey('user', ['name']),
      ];
    }

    class SecondMigration implements MigrationDescription {
      id = 'test2';
      steps = [
        new RelationalAddTableForeignKey('user', 'role', ['roleId'], 'role', [
          'id',
        ]),
      ];
      after = 'test';
    }

    await applyMigrations(dataAdapter, [FirstMigration, SecondMigration]);
    await expectTables(dataAdapter, 'public', {
      migrations: ['id'],
      test_role: ['test_id'],
      test_user: ['test_name', 'test_roleId'],
    });
  });

  it('should accept reference in second migration', async () => {
    class FirstMigration implements MigrationDescription {
      id = 'test';
      steps = [
        new RelationalAddTableMigrationStep('role'),
        new RelationalAddTableFieldMigrationStep('role', 'id', 'number'),
        new RelationalAddTablePrimaryKey('role', ['id']),
        new RelationalAddTableMigrationStep('user'),
        new RelationalAddTableFieldMigrationStep('user', 'name', 'string'),
        new RelationalAddTablePrimaryKey('user', ['name']),
      ];
    }
    class SecondMigration implements MigrationDescription {
      id = 'test2';
      steps = [
        new RelationalAddTableFieldMigrationStep('user', 'roleId', 'number'),
        new RelationalAddTableForeignKey('user', 'role', ['roleId'], 'role', [
          'id',
        ]),
      ];
      after = 'test';
    }

    await applyMigrations(dataAdapter, [FirstMigration, SecondMigration]);
    await expectTables(dataAdapter, 'public', {
      migrations: ['id'],
      test_role: ['test_id'],
      test_user: ['test_name', 'test2_roleId'],
    });
  });
});

async function applyMigrations(
  dataAdapter: RelationalDataAdapter,
  migrations: DefaultConstructable<MigrationDescription>[],
) {
  const schema = new RelationalSchema();
  for (const migration of migrations) {
    schema.migration(migration);
  }
  const context = schema.context(dataAdapter);
  await context.migration().apply();
}

async function getTableNames(
  dataAdapter: RelationalDataAdapter,
  schema: string,
) {
  const res = await dataAdapter.raw(
    `SELECT table_name FROM information_schema.tables WHERE table_schema='${schema}';`,
    [],
  );
  return res.rows.map(r => r.table_name);
}

async function tableExists(
  dataAdapter: RelationalDataAdapter,
  schema: string,
  table: string,
) {
  const res = await dataAdapter.raw(
    `SELECT table_name FROM information_schema.tables WHERE table_schema='${schema}' AND table_name='${table}';`,
    [],
  );
  return res.rowCount === 1;
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

async function expectTableExists(
  dataAdapter: RelationalDataAdapter,
  schema: string,
  table: string,
) {
  const exists = await tableExists(dataAdapter, schema, table);
  expect(exists).to.eq(true, `table ${schema}.${table} should exists`);
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

  expect(actualTables).to.be.deep.eq(expectedTables);
}
