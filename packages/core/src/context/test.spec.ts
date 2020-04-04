import {context} from './test';
import {RelationalAdapterMock} from '../testing/relational-adapter-mock';

export class User {
  id!: string;
  foo!: string;
  parentId?: string;
  parent?: User;

  static table = 'foo';
  static schema = 'public';
}

describe('test', () => {
  it('test delete', async () => {
    const dataAdapter = new RelationalAdapterMock();
    dataAdapter.expect({
      delete: {table: 'foo', schema: 'public'},
      where: {
        left: {field: 'foo'},
        operand: '=',
        right: 'bar',
      },
    }, {
      rowCount: 0,
      rows: [],
    });

    const ctx = context(dataAdapter);
    await ctx.delete(User).where({
      foo: 'bar',
    });
  });

  it('test select', async () => {
    const dataAdapter = new RelationalAdapterMock();
    dataAdapter.expect({
      select: [
        {all: true, schema: 'public', table: 'foo'},
      ],
      from: {table: 'foo', schema: 'public'},
      where: {
        left: {field: 'foo'},
        operand: '=',
        right: 'bar',
      },
    }, {
      rowCount: 0,
      rows: [],
    });

    const ctx = context(dataAdapter);
    await ctx.select(User).where({
      foo: 'bar',
    });
  });

  it('test select nested', async () => {
    const dataAdapter = new RelationalAdapterMock();
    dataAdapter.expect({
      select: [
        {all:true, schema: 'public', table: 'foo'},
        {all:true, table: 'parent'}
      ],
      from: {table: 'foo', schema: 'public'},
      joins: [
        {
          type: 'inner',
          from: {table: 'foo', schema: 'public', alias: 'parent'},
          on: {left: {field: 'parentId', table: 'foo', schema: 'public'}, operand: '=', right: {field: 'id', table: 'parent'}},
        },
      ],
      where: {
        left: {field: 'foo', table: 'parent'},
        operand: '=',
        right: 'bar',
      },
    }, {
      rowCount: 0,
      rows: [],
    });

    const ctx = context(dataAdapter);
    await ctx.select(User)
      .join(User, 'parent', on => on.eq(u => u.parentId, p => p.parent.id))
      .where({
        parent: {
          foo: 'bar',
        },
      });
  });

  it('test insert', async () => {
    const dataAdapter = new RelationalAdapterMock();
    dataAdapter.expect({
      insert: {table: 'foo', schema: 'public'},
      values: [{foo: 'bar', id: 'a'}],
    }, {
      rowCount: 0,
      rows: [],
    });

    const ctx = context(dataAdapter);
    await ctx.insert(User).value({
      foo: 'bar',
      id: 'a',
    });
  });

});
