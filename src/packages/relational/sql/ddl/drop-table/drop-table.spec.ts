import { expectedSql } from '../../../../../testing/relational/formatter.test';
import { User } from '../../../../../testing/schema/user';
import { table } from '../../keyword/table/table';

describe('drop-table', () => {
  it('should drop table', () => {
    expectedSql(
      {
        dropTable: table(User),
      },
      'DROP TABLE "auth"."user"',
    );
  });
  it('should drop table if exists', () => {
    expectedSql(
      {
        dropTable: table(User),
        ifExists: true,
      },
      'DROP TABLE IF EXISTS "auth"."user"',
    );
  });
});
