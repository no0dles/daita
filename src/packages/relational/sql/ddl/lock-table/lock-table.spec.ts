import { expectedSql } from '../../../../../testing/relational/formatter.test';
import { table } from '../../keyword/table/table';
import { User } from '../../../../../testing/schema/user';

describe('lock-table', () => {
  it('should lock table', () => {
    expectedSql(
      {
        lockTable: table(User),
      },
      'LOCK TABLE "auth"."user"',
    );
  });
});
