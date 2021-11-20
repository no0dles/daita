import { evaluateRule, RuleEvaluator, RulesEvaluator } from './validate';
import { allow } from './function/allow';
import { authorized } from './function/authorized';
import { all } from '../sql/keyword/all/all';
import { table } from '../sql/keyword/table/table';
import { MigrationStorage } from '../../orm/migration/schema/migration-storage';
import { testClient } from '../../../testing/relational/adapters';
import { MigrationTree } from '../../orm/migration/migration-tree';
import { equal } from '../sql/operands/comparison/equal/equal';
import { field } from '../sql/keyword/field/field';
import { requestContext } from './function/request-context';

describe('relational/permission', () => {
  it('should', async () => {
    const client = testClient('sqlite')[0];
    const storage = new MigrationStorage({
      idType: { type: 'string' },
      transactionClient: client,
    });
    await storage.add(client, 'test', {
      id: 'init',
      steps: [
        {
          kind: 'add_rule',
          rule: allow(authorized(), {
            select: all(),
            from: table('user'),
            where: equal(field(table('user'), 'test'), requestContext().userId),
          }),
          ruleId: 'a',
        },
      ],
    });
    const migrations = await storage.get('test');
    const migrationTree = new MigrationTree('test', migrations);
    const ruleMap = migrationTree.getSchemaDescription().rules || {};
    const evalator = new RulesEvaluator(Object.keys(ruleMap).map((k) => ({ id: k, rule: ruleMap[k] })));

    const result = evalator.evaluate(
      { roles: [], isAuthorized: true, userId: 'a' },
      {
        select: all(),
        from: table('user'),
        where: equal(field(table('user'), 'test'), 'a'),
      },
    );
    console.log(result);
  });
});
