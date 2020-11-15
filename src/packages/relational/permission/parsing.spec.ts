import { parseRule, parseRules, serializeRule, serializeRules } from './parsing';
import { field } from '../sql/keyword/field/field';
import { table } from '../sql/keyword/table/table';
import { matchesRules } from './validate';
import { allow } from './function/allow';
import { requestContext } from './function/request-context';
import { and } from '../sql/keyword/and/and';
import { authorized } from './function/authorized';
import { allowRegex } from './function/allow-regex';
import { TableDescription } from '../sql/keyword/table/table-description';
import { equal } from '../sql/operands/comparison/equal/equal';

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
    parseRule(serialized);
  });
});
