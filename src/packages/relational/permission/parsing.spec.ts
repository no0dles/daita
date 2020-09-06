import { allow, allowRegex, authorized, requestContext } from './function';
import { parseRules, serializeRules } from './parsing';
import { and, equal } from '../sql/function';
import { field } from '../sql/function/field';
import { table } from '../sql/function/table';
import { TableDescription } from '../sql/description';
import { matchesRules } from './validate';

describe('parsing', () => {
  it('should serialize request context and regexp', () => {
    const tbl = table('tbl') as TableDescription<any>;
    const srcRules = [
      allow(authorized(), {
        select: 'test',
        from: tbl,
        where: and(
          equal(field(tbl, 'foo'), requestContext().userId),
          equal(field(tbl, 'bar'), allowRegex(/^[a-zA-Z]+$/)),
        ),
      }),
    ];
    const jsonRules = serializeRules(srcRules);
    const dstRules = parseRules(jsonRules);
    const matches = matchesRules(
      {
        select: 'test',
        from: tbl,
        where: and(
          equal(field(tbl, 'foo'), 'foo'),
          equal(field(tbl, 'bar'), 'abc'),
        ),
      },
      dstRules,
      { isAuthorized: true, userId: 'foo' },
    );
    expect(matches).toBeTruthy();
  });
});
