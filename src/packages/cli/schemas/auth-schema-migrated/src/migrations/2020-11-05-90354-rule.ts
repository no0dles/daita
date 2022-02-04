import { MigrationDescription } from '@daita/orm';

export const RuleMigration: MigrationDescription = {
  id: 'rule',
  after: 'init',
  steps: [
    {
      kind: 'add_rule',
      rule: {
        type: 'allow',
        auth: { type: 'authorized' },
        sql: {
          update: { table: 'User' },
          set: { password: { anything: {} } },
          where: {
            equal: {
              left: { field: { key: 'username', table: { table: 'User' } } },
              right: { $requestContext: { key: 'userId' } },
            },
          },
        },
      },
      ruleId: '220809938',
    },
  ],
};
