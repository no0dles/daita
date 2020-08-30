import { RelationalSchema } from '../schema';
import { RelationalSchemaOptions } from '../schema/relational-schema-options';
import { getMockContext } from './get-mock-context';
import {field, table} from '../../relational/sql/function';

class User {
  id!: string;
  name!: string;
}

describe('get-context', () => {
  it('should map select for', async () => {
    await testSchema({ backwardCompatible: true }, sql => {
      expect(sql).toEqual({
        select: {
          id: { field: { key: 'id_first', table: {table: 'User_first'} } },
          name: { field: { key: 'name_first', table: {table: 'User_first'} } },
        },
        from: {table: 'User_first'},
      });
    });
  });

  it('should not map without backward compatibility', async () => {
    await testSchema({ backwardCompatible: false }, sql => {
      expect(sql).toEqual({
        select: {
          id: { field: { key: 'id', table: {table: 'User'} } },
          name: { field: { key: 'name', table: {table: 'User'} } },
        },
        from: {table: 'User'},
      });
    });
  });
});

async function testSchema(options: RelationalSchemaOptions, testSql: (sql: any) => void) {
  const schema = new RelationalSchema(options);
  schema.table(User);
  schema.migration({
    id: 'first',
    steps: [
      { kind: 'add_table', table: 'User' },
      { kind: 'add_table_field', table: 'User', fieldName: 'id', type: 'string', required: true },
      { kind: 'add_table_field', table: 'User', fieldName: 'name', type: 'string', required: true },
      { kind: 'add_table_primary_key', table: 'User', fieldNames: ['id'] },
    ],
  });

  const ctx = getMockContext(schema, sql => {
    testSql(sql);
    return {
      rows: [{ id: 'a', name: 'name' }],
      rowCount: 1,
    };
  });
  const result = await ctx.select({
    select: {
      id: field(User, 'id'),
      name: field(User, 'name'),
    },
    from: table(User),
  });
  expect(result.length).toBe(1);
  expect(result[0].id).toBe('a');
  expect(result[0].name).toBe('name');
}
