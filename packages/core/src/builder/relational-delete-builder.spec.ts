import {SqlTable} from '../sql/sql-table';
import {RelationalAdapterMock} from '../testing/relational-adapter-mock';
import {RelationalDeleteBuilder} from './relational-delete-builder';
import {isSqlDelete, SqlDelete} from '../sql/delete/sql-delete';

async function testDelete<T>(sqlTable: SqlTable, action: (builder: RelationalDeleteBuilder<T>) => RelationalDeleteBuilder<T>, expectedQueryOrError: SqlDelete | Error) {
  const relationalAdapter = new RelationalAdapterMock();
  const builder = new RelationalDeleteBuilder<T>(relationalAdapter, sqlTable);

  if (isSqlDelete(expectedQueryOrError)) {
    relationalAdapter.expect(expectedQueryOrError);
    await action(builder);
  } else {
    await expect(() => action(builder)).toThrowError(expectedQueryOrError);
  }
}

describe('builder/relational-delete-builder', () => {
  it('should delete({table: User}).where({foo: 1, bar: test})', async () => {
    await testDelete({table: 'User'}, builder => builder.where({foo: 1, bar: 'test'}), {
      delete: {table: 'User'},
      where: {
        and: [
          {left: {field: 'foo'}, operand: '=', right: 1},
          {left: {field: 'bar'}, operand: '=', right: 'test'}
        ]
      },
    });
  });

  it('should not allow update({table: User}).where({parent:{foo: 2}})', async () => {
    await testDelete({table: 'User'}, builder => builder.where({parent: {foo: 2}}), new Error('not supported yet'));
  });
});