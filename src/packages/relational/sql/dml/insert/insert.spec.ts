import { expectedSql } from '../../../../../testing/relational/formatter.test';
import { User } from '../../../../../examples/mowntain/models/user';
import { table } from '../../keyword/table/table';
import { field } from '../../keyword/field/field';
import { alias } from '../../keyword/alias/alias';

describe('insert', () => {
  it('should insert from object', () => {
    expectedSql(
      {
        insert: { id: '1' },
        into: table(User),
      },
      'INSERT INTO "auth"."user" ("id") VALUES ($1)',
      ['1'],
    );
  });

  it('should insert from array', () => {
    expectedSql(
      {
        insert: [{ id: '1' }, { name: 'foo' }],
        into: table(User),
      },
      'INSERT INTO "auth"."user" ("id", "name") VALUES ($1, $2), ($2, $3)',
      ['1', undefined, 'foo'],
    );
  });

  it('should insert from select', () => {
    expectedSql(
      {
        insert: {
          select: {
            id: field(alias(User, 'u'), 'id'),
          },
          from: alias(User, 'u'),
        },
        into: table(User),
      },
      'INSERT INTO "auth"."user" ("id") SELECT "u"."id" AS "id" FROM "auth"."user" "u"',
    );
  });
});
