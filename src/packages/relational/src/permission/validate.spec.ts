import { RulesEvaluator } from './validate';
import { allow } from './function/allow';
import { authorized } from './function/authorized';
import { all } from '../sql/keyword/all/all';
import { table } from '../sql/keyword/table/table';
import { equal } from '../sql/operands/comparison/equal/equal';
import { field } from '../sql/keyword/field/field';
import { requestContext } from './function/request-context';

describe('relational/permission', () => {
  it('should', async () => {
    const evalator = new RulesEvaluator([
      {
        id: 'a',
        rule: allow(authorized(), {
          select: all(),
          from: table('user'),
          where: equal(field(table('user'), 'test'), requestContext().userId),
        }),
      },
    ]);

    const result = evalator.evaluate(
      { roles: [], isAuthorized: true, userId: 'a' },
      {
        select: all(),
        from: table('user'),
        where: equal(field(table('user'), 'test'), 'a'),
      },
    );
    expect(result).not.toBeNull();
    expect(result).not.toBeUndefined();
    expect(result!.id).toBe('a');
    expect(result!.type).toBe('allow');
  });
});
