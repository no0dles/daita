import { expectedSql } from '../formatter.test';
import { all } from '../../sql/function/all';
import { table } from '../../sql/function/table';

describe('all', () => {
  it('should select all from table', () => {
    expectedSql({
      select: all(table('foo')),
      from: table('foo'),
    }, 'SELECT "foo".* FROM "foo"');
  });

  it('should select all', () => {
    expectedSql({
      select: all(),
      from: table('foo'),
    }, 'SELECT * FROM "foo"');
  });
});
