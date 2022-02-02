import { RelationalAdapter, table } from '@daita/relational';
import { all } from '@daita/relational';
import { migrate, MigrationTree, RelationalOrmAdapter } from '@daita/orm';
import { cleanupTestContext, getContexts, getTestAdapter } from '../../../testing';

describe('packages/orm/migration/steps/add-table-field', () => {
  const migrationTree = new MigrationTree('', [
    {
      id: 'init',
      steps: [
        { kind: 'add_table', table: 'foo' },
        { kind: 'add_table_field', table: 'foo', fieldName: 'id', type: 'uuid', required: true },
        { kind: 'add_table_field', table: 'foo', fieldName: 'text', type: 'string', required: false },
        { kind: 'add_table_field', table: 'foo', fieldName: 'count', type: 'number', required: false },
      ],
    },
    {
      id: 'second',
      steps: [
        { kind: 'add_table_field', table: 'foo', fieldName: 'date', type: 'date', required: false },
        { kind: 'add_table_field', table: 'foo', fieldName: 'uuid', type: 'uuid', required: false },
      ],
      after: 'init',
    },
  ]);

  let ctx: RelationalOrmAdapter & RelationalAdapter<any>;

  beforeAll(async () => {
    ctx = await getTestAdapter();
    await migrate(ctx, migrationTree);
  });

  afterAll(async () => ctx.close());

  it('should be insertable and selectable', async () => {
    const date = new Date();
    await ctx.insert({
      into: table('foo'),
      insert: {
        id: 'd015a090-7c69-4472-b108-a4f8ab77443d',
        text: 'test',
        count: 2,
        date,
        uuid: 'd015a090-7c69-4472-b108-a4f8ab77443c',
      },
    });
    const row = await ctx.selectFirst({
      select: all(),
      from: table('foo'),
    });
    expect(row).not.toBeNull();
    expect(row).not.toBeUndefined();
    expect(row.id).toEqual('d015a090-7c69-4472-b108-a4f8ab77443d');
    expect(row.text).toEqual('test');
    expect(row.count).toEqual(2);
    expect(row.date).toBeInstanceOf(Date);
    expect(row.date).toEqual(date);
    expect(row.uuid).toEqual('d015a090-7c69-4472-b108-a4f8ab77443c');
  });
});
