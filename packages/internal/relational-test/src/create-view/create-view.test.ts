import { RelationalTest } from '../relational-test';
import { testAdapter } from '../adapters';
import { getClient, table } from '@daita/relational';

export function createViewTest(arg: RelationalTest) {
  describe('create-view', () => {
    describe('should create view', testAdapter(arg, async (adapter) => {
      const client = getClient(adapter);
      await client.exec({
        createView: table('TestView'),
        orReplace: true,
        as: {
          select: 'foo',
        },
      });
    }));
  });
}
