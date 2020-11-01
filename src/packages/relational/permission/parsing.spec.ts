import { parseRule, parseRules, serializeRule, serializeRules } from './parsing';
import { field } from '../sql/function/field';
import { table } from '../sql/function/table';
import { matchesRules } from './validate';
import { allow } from './function/allow';
import { requestContext } from './function/request-context';
import { and } from '../sql/function/and';
import { authorized } from './function/authorized';
import { allowRegex } from './function/allow-regex';
import { TableDescription } from '../sql/description/table';
import { equal } from '../sql/function/equal';

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
        where: and(equal(field(tbl, 'foo'), 'foo'), equal(field(tbl, 'bar'), 'abc')),
      },
      dstRules,
      { isAuthorized: true, userId: 'foo' },
    );
    expect(matches).toBeTruthy();
  });

  it('should serialize regexp', () => {
    const serialized = serializeRule(allow(authorized(), allowRegex(/^[a-z]+$/) as any));
    const deserialized = parseRule(serialized);
    console.log(deserialized);
  });
});
