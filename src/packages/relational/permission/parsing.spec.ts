import { allow, authorized, requestContext } from './function';
import { parseRules } from './parsing';
import { equal } from '../sql/function';
import { field } from '../sql/function/field';
import { table } from '../sql/function/table';
import { TableDescription } from '../sql/description';
import { matchesRules } from './validate';

describe('parsing', () => {
  it('should', () => {
    const srcRules = [
      allow(authorized(), {
        select: 'test',
        from: table('tbl'),
        where: equal(field(table('tbl') as TableDescription<any>, 'foo'), requestContext().userId),
      }),
    ];
    const jsonRules = JSON.stringify(srcRules);
    const dstRules = parseRules(jsonRules);
    const matches = matchesRules({
      select: 'test',
      from: table('tbl'),
      where: equal(field(table('tbl') as TableDescription<any>, 'foo'), 'foo')
    }, dstRules, {isAuthorized: true, userId: 'foo'})
    expect(matches).toBeTruthy();
  });
});
