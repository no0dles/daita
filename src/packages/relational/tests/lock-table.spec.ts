import { expectedSql } from './formatter.test';
import { table } from '../sql/function/table';
import { User } from './schema/user';

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
