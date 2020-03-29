import {User} from '../test/schemas/blog/models/user';
import {blogSchema} from '../test/schemas/blog/schema';
import {RelationalDataContext} from '../context/relational-data-context';
import {Comment} from '../test/schemas/blog/models/comment';
import {RelationalAdapterMock} from '../testing/relational-adapter-mock';
import {SqlQuery, SqlSelect} from '../sql';

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
    await expectQuery(ctx => ctx.select(User).where({parent: {name: 'foo'}}), {
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
    await expectQuery(ctx => ctx.select(User).where({parent: {parent: {name: 'foo'}}}), {
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
    await expectQuery(ctx => ctx.select(User).orderBy(u => u.parent.id, 'asc'), {
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

  it('should add nested where conditions', async () => {
    await expectQuery(ctx => ctx.select(Comment).where({user: {name: 'foo'}}), {
      select: [
        {field: 'id_second', table: 'base', alias: 'base.id'},
        {field: 'text_second', table: 'base', alias: 'base.text'},
        {field: 'userId_second', table: 'base', alias: 'base.userId'},
      ],
      from: {table: 'Comment_second', alias: 'base'},
      joins: [
        {
          from: {table: 'User_first', alias: 'base_user'},
          type: 'left',
          on: {
            left: {table: 'base', field: 'userId_second'},
            operand: '=',
            right: {table: 'base_user', field: 'id_first'},
          },
        },
      ],
      where: {
        left: {table: 'base_user', field: 'name_first'},
        operand: '=',
        right: 'foo',
      },
    } as SqlSelect);
  });

  it('should add nested recursive where conditions', async () => {
    await expectQuery(ctx => ctx.select(User).where({parent: {name: 'foo'}}), {
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

  it('should should delete with single condition', async () => {
    await expectQuery(ctx => ctx.delete(User).where({name: 'foo'}), {
      delete: 'User_first',
      where: {
        left: {field: 'name_first'},
        operand: '=',
        right: 'foo',
      },
    });
  });
});