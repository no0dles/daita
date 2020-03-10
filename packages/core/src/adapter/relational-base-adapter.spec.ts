import {RelationalBaseAdapter} from './relational-base-adapter';
import {SqlSelect} from '../sql/sql-select';
import {SqlDelete} from '../sql/sql-delete';
import {SqlInsert} from '../sql/sql-insert';
import {RelationalRawResult} from './relational-raw-result';
import {SqlUpdate} from '../sql/sql-update';
import {User} from '../test/schemas/blog/models/user';
import {SqlQuery} from '../sql/sql-query';
import {Defer} from '../defer';
import {blogSchema} from '../test/schemas/blog/schema';
import {RelationalDataContext} from '../context/relational-data-context';
import {blogAdminUser} from '../test/schemas/blog/users';

describe('test', () => {

  async function testQuery(fn: (context: RelationalDataContext) => PromiseLike<any>): Promise<SqlQuery | string> {
    const defer = new Defer<SqlQuery | string>();

    class MockRelationalTest extends RelationalBaseAdapter {
      isKind(kind: 'data' | 'migration' | 'transaction'): boolean {
        return true;
      }

      protected runQuery(sql: SqlSelect | SqlDelete | SqlUpdate | SqlInsert | string, values?: any[]): Promise<RelationalRawResult> {
        defer.resolve(sql);
        throw new Error('mock');
      }
    }

    const mock = new MockRelationalTest();
    const context = blogSchema.context(mock, {user: blogAdminUser});
    try {
      await fn(context);
    } catch (e) {
      if (e.message !== 'mock') {
        defer.reject(e);
      }
    }

    return defer.promise;
  }

  it('should include join', async () => {
    const query = await testQuery(mock => mock.select(User).include(u => u.parent));
    expect(query).toEqual({
      select: [
        {field: 'id_first', table: 'base', alias: 'base.id'},
        {field: 'name_first', table: 'base', alias: 'base.name'},
        {field: 'count_first', table: 'base', alias: 'base.count'},
        {field: 'parentId_first', table: 'base', alias: 'base.parentId'},
        {field: 'admin_second', table: 'base', alias: 'base.admin'},
        {field: 'id_first', table: 'base_parent', alias: 'base_parent.id'},
        {field: 'name_first', table: 'base_parent', alias: 'base_parent.name'},
        {field: 'count_first', table: 'base_parent', alias: 'base_parent.count'},
        {field: 'parentId_first', table: 'base_parent', alias: 'base_parent.parentId'},
        {field: 'admin_second', table: 'base_parent', alias: 'base_parent.admin'},
      ],
      from: {table: 'User_first', alias: 'base'},
      joins: [
        {
          from: {table: 'User_first', alias: 'base_parent'},
          type: 'left',
          on: {
            left: {table: 'base', field: 'parentId_first'},
            operand: '=',
            right: {table: 'base_parent', field: 'id_first'},
          },
        },
      ],
    } as SqlSelect);
  });

  it('should join for where condition', async () => {
    const query = await testQuery(mock => mock.select(User).where({parent: {name: 'foo'}}));
    expect(query).toEqual({
      select: [
        {field: 'id_first', table: 'base', alias: 'base.id'},
        {field: 'name_first', table: 'base', alias: 'base.name'},
        {field: 'count_first', table: 'base', alias: 'base.count'},
        {field: 'parentId_first', table: 'base', alias: 'base.parentId'},
        {field: 'admin_second', table: 'base', alias: 'base.admin'},
      ],
      from: {table: 'User_first', alias: 'base'},
      joins: [
        {
          from: {table: 'User_first', alias: 'base_parent'},
          type: 'left',
          on: {
            left: {table: 'base', field: 'parentId_first'},
            operand: '=',
            right: {table: 'base_parent', field: 'id_first'},
          },
        },
      ],
      where: {
        left: {table: 'base_parent', field: 'name_first'},
        operand: '=',
        right: 'foo',
      },
    } as SqlSelect);
  });

  it('should nested join for where condition', async () => {
    const query = await testQuery(mock => mock.select(User).where({parent: {parent:{name: 'foo'}}}));
    expect(query).toEqual({
      select: [
        {field: 'id_first', table: 'base', alias: 'base.id'},
        {field: 'name_first', table: 'base', alias: 'base.name'},
        {field: 'count_first', table: 'base', alias: 'base.count'},
        {field: 'parentId_first', table: 'base', alias: 'base.parentId'},
        {field: 'admin_second', table: 'base', alias: 'base.admin'},
      ],
      from: {table: 'User_first', alias: 'base'},
      joins: [
        {
          from: {table: 'User_first', alias: 'base_parent'},
          type: 'left',
          on: {
            left: {table: 'base', field: 'parentId_first'},
            operand: '=',
            right: {table: 'base_parent', field: 'id_first'},
          },
        },
        {
          from: {table: 'User_first', alias: 'base_parent_parent'},
          type: 'left',
          on: {
            left: {table: 'base_parent', field: 'parentId_first'},
            operand: '=',
            right: {table: 'base_parent_parent', field: 'id_first'},
          },
        },
      ],
      where: {
        left: {table: 'base_parent_parent', field: 'name_first'},
        operand: '=',
        right: 'foo',
      },
    } as SqlSelect);
  });

  it('should add join for order by', async () => {
    const query = await testQuery(mock => mock.select(User).orderBy(u => u.parent.id, 'asc'));
    expect(query).toEqual({
      select: [
        {field: 'id_first', table: 'base', alias: 'base.id'},
        {field: 'name_first', table: 'base', alias: 'base.name'},
        {field: 'count_first', table: 'base', alias: 'base.count'},
        {field: 'parentId_first', table: 'base', alias: 'base.parentId'},
        {field: 'admin_second', table: 'base', alias: 'base.admin'},
      ],
      from: {table: 'User_first', alias: 'base'},
      joins: [
        {
          from: {table: 'User_first', alias: 'base_parent'},
          type: 'left',
          on: {
            left: {table: 'base', field: 'parentId_first'},
            operand: '=',
            right: {table: 'base_parent', field: 'id_first'},
          },
        },
      ],
      orderBy: [
        {field: 'id_first', table: 'base_parent', direction: 'asc'},
      ],
    } as SqlSelect);
  });

  it('should should delete with single condition', async () => {
    const query = await testQuery(mock => mock.delete(User).where({name: 'foo'}));
    expect(query).toEqual({
      delete: 'User_first',
      where: {
        left: {field: 'name_first'},
        operand: '=',
        right: 'foo',
      },
    });
  });
});