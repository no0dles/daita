import { expectedSql } from './formatter.test';
import { User } from './schema/user';
import { table } from '../sql/function/table';

describe('drop-table', () => {
  it('should drop table', () => {
    expectedSql({
      dropTable: table(User),
    }, 'DROP TABLE "auth"."user"');
  });
  it('should drop table if exists', () => {
    expectedSql({
      dropTable: table(User),
      ifExists: true
    }, 'DROP TABLE IF EXISTS "auth"."user"');
  });
});
