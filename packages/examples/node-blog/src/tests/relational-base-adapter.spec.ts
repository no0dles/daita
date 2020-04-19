import {RelationalAdapterMock, RelationalDataContext, SqlQuery, SqlSelect} from '@daita/core';
import {User} from '../models/user';
import {Comment} from '../models/comment';
import {blogSchema} from '../schema';

describe('test', () => {

  async function expectQuery(fn: (context: RelationalDataContext) => Promise<any>, query: SqlQuery): Promise<void> {
    const mock = new RelationalAdapterMock();
    mock.expect(query, {rows: [], rowCount: 0});
    const context = blogSchema.context(mock);
    await fn(context);
  }

  it('should include join', async () => {
    await expectQuery(ctx => ctx.select(User).include(u => u.parent), {
      select: [
        {field: 'id_first', table: 'base', alias: 'id'},
        {field: 'name_first', table: 'base', alias: 'name'},
        {field: 'count_first', table: 'base', alias: 'count'},
        {field: 'parentId_first', table: 'base', alias: 'parentId'},
        {field: 'admin_second', table: 'base', alias: 'admin'},
        {field: 'id_first', table: 'parent', alias: 'parent.id'},
        {field: 'name_first', table: 'parent', alias: 'parent.name'},
        {field: 'count_first', table: 'parent', alias: 'parent.count'},
        {field: 'parentId_first', table: 'parent', alias: 'parent.parentId'},
        {field: 'admin_second', table: 'parent', alias: 'parent.admin'},
      ],
      from: {table: 'User_first', alias: 'base'},
      joins: [
        {
          from: {table: 'User_first', alias: 'parent'},
          type: 'left',
          on: {
            left: {table: 'base', field: 'parentId_first'},
            operand: '=',
            right: {table: 'parent', field: 'id_first'},
          },
        },
      ],
    } as SqlSelect);
  });

  it('should join for where condition', async () => {
    await expectQuery(ctx => ctx.select(User).where({parent: {name: 'foo'}}), {
      select: [
        {field: 'id_first', table: 'base', alias: 'id'},
        {field: 'name_first', table: 'base', alias: 'name'},
        {field: 'count_first', table: 'base', alias: 'count'},
        {field: 'parentId_first', table: 'base', alias: 'parentId'},
        {field: 'admin_second', table: 'base', alias: 'admin'},
      ],
      from: {table: 'User_first', alias: 'base'},
      joins: [
        {
          from: {table: 'User_first', alias: 'parent'},
          type: 'left',
          on: {
            left: {table: 'base', field: 'parentId_first'},
            operand: '=',
            right: {table: 'parent', field: 'id_first'},
          },
        },
      ],
      where: {
        left: {table: 'parent', field: 'name_first'},
        operand: '=',
        right: 'foo',
      },
    } as SqlSelect);
  });

  it('should nested join for where condition', async () => {
    await expectQuery(ctx => ctx.select(User).where({parent: {parent: {name: 'foo'}}}), {
      select: [
        {field: 'id_first', table: 'base', alias: 'id'},
        {field: 'name_first', table: 'base', alias: 'name'},
        {field: 'count_first', table: 'base', alias: 'count'},
        {field: 'parentId_first', table: 'base', alias: 'parentId'},
        {field: 'admin_second', table: 'base', alias: 'admin'},
      ],
      from: {table: 'User_first', alias: 'base'},
      joins: [
        {
          from: {table: 'User_first', alias: 'parent'},
          type: 'left',
          on: {
            left: {table: 'base', field: 'parentId_first'},
            operand: '=',
            right: {table: 'parent', field: 'id_first'},
          },
        },
        {
          from: {table: 'User_first', alias: 'parent.parent'},
          type: 'left',
          on: {
            left: {table: 'parent', field: 'parentId_first'},
            operand: '=',
            right: {table: 'parent.parent', field: 'id_first'},
          },
        },
      ],
      where: {
        left: {table: 'parent.parent', field: 'name_first'},
        operand: '=',
        right: 'foo',
      },
    } as SqlSelect);
  });

  it('should add join for order by', async () => {
    await expectQuery(async ctx => {
      const builder = ctx.select(User).orderBy(u => u.parent.id, 'asc');
      return await builder;
    }, {
      select: [
        {field: 'id_first', table: 'base', alias: 'id'},
        {field: 'name_first', table: 'base', alias: 'name'},
        {field: 'count_first', table: 'base', alias: 'count'},
        {field: 'parentId_first', table: 'base', alias: 'parentId'},
        {field: 'admin_second', table: 'base', alias: 'admin'},
      ],
      from: {table: 'User_first', alias: 'base'},
      joins: [
        {
          from: {table: 'User_first', alias: 'parent'},
          type: 'left',
          on: {
            left: {table: 'base', field: 'parentId_first'},
            operand: '=',
            right: {table: 'parent', field: 'id_first'},
          },
        },
      ],
      orderBy: [
        {field: 'id_first', table: 'parent', direction: 'asc'},
      ],
    } as SqlSelect);
  });

  it('should add nested where conditions', async () => {
    await expectQuery(ctx => ctx.select(Comment).where({user: {name: 'foo'}}), {
      select: [
        {field: 'id_second', table: 'base', alias: 'id'},
        {field: 'text_second', table: 'base', alias: 'text'},
        {field: 'userId_second', table: 'base', alias: 'userId'},
      ],
      from: {table: 'Comment_second', alias: 'base'},
      joins: [
        {
          from: {table: 'User_first', alias: 'user'},
          type: 'left',
          on: {
            left: {table: 'base', field: 'userId_second'},
            operand: '=',
            right: {table: 'user', field: 'id_first'},
          },
        },
      ],
      where: {
        left: {table: 'user', field: 'name_first'},
        operand: '=',
        right: 'foo',
      },
    } as SqlSelect);
  });

  it('should add nested recursive where conditions', async () => {
    await expectQuery(ctx => ctx.select(User).where({parent: {name: 'foo'}}), {
      select: [
        {field: 'id_first', table: 'base', alias: 'id'},
        {field: 'name_first', table: 'base', alias: 'name'},
        {field: 'count_first', table: 'base', alias: 'count'},
        {field: 'parentId_first', table: 'base', alias: 'parentId'},
        {field: 'admin_second', table: 'base', alias: 'admin'},
      ],
      from: {table: 'User_first', alias: 'base'},
      joins: [
        {
          from: {table: 'User_first', alias: 'parent'},
          type: 'left',
          on: {
            left: {table: 'base', field: 'parentId_first'},
            operand: '=',
            right: {table: 'parent', field: 'id_first'},
          },
        },
      ],
      where: {
        left: {table: 'parent', field: 'name_first'},
        operand: '=',
        right: 'foo',
      },
    } as SqlSelect);
  });

  it('should should delete with single condition', async () => {
    await expectQuery(ctx => ctx.delete(User).where({name: 'foo'}), {
      delete: {table: 'User_first'},
      where: {
        left: {field: 'name_first'},
        operand: '=',
        right: 'foo',
      },
    });
  });
});
