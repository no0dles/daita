import { expectedSql } from '../../../../../testing/relational/formatter.test';
import { all } from './all';
import { table } from '../table/table';

describe('all', () => {
  it('should select all from table', () => {
    expectedSql(
      {
        select: all(table('foo')),
        from: table('foo'),
      },
      'SELECT "foo".* FROM "foo"',
    );
  });

  it('should select all', () => {
    expectedSql(
      {
        select: all(),
        from: table('foo'),
      },
      'SELECT * FROM "foo"',
    );
  });
});
