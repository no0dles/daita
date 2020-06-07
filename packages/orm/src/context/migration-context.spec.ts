import { getMigrationContext } from './get-migration-context';
import {
  Client,
  getMockClient,
  isSelectSql,
  SelectClient, TransactionClient,
} from '@daita/relational';
import { table } from '@daita/relational';
import { RelationalSchema } from '../schema';
import { MigrationSql } from './orm-migration-context';

describe('migration-context', () => {
  it('should create migration table', async () => {
    const client = getMockClient(sql => null);
    const schema = new RelationalSchema();
    await testUpdates(schema, client, [
      {
        createTable: table('migrations', 'daita'),
        columns: [{ name: 'id', primaryKey: true, notNull: true, type: 'string' }],
      },
    ]);
  });

  it('should do nothing if migration id is in migration table', async () => {
    const client = getMockClient(sql => {
      if (isSelectSql(sql)) {
        return { rows: [{ id: 'first' }], rowCount: 1 };
      }
      return null;
    });
    const schema = new RelationalSchema();
    schema.migration({
      id: 'first',
      steps: [
        { kind: 'add_table', table: 'user' },
        {
          kind: 'add_table_field',
          table: 'user',
          fieldName: 'name',
          type: 'string',
          required: false,
          defaultValue: null,
        },
      ],
    });
    await testUpdates(schema, client, []);
  });

  it('should generate create table for empty migration table', async () => {
    const client = getMockClient(sql => {
      if (isSelectSql(sql)) {
        return { rows: [], rowCount: 0 };
      }
      return null;
    });
    const schema = new RelationalSchema();
    schema.migration({
      id: 'first',
      steps: [
        { kind: 'add_table', table: 'user' },
        {
          kind: 'add_table_field',
          table: 'user',
          fieldName: 'name',
          type: 'string',
          required: false,
          defaultValue: null,
        },
      ],
    });
    await testUpdates(schema, client, [
      { createTable: table('user'), columns: [{ name: 'name', primaryKey: false, notNull: false, type: 'string' }] },
    ]);
  });
});

async function testUpdates(schema: RelationalSchema, client: TransactionClient<SelectClient & Client<MigrationSql>> & SelectClient, expecedSqls: MigrationSql[]) {
  const ctx = getMigrationContext(client, schema);
  const updates = await ctx.pendingUpdates();
  expect(updates).toEqual(expecedSqls);
}
