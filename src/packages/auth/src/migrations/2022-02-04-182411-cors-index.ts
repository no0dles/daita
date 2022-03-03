import { MigrationDescription } from '@daita/orm';

export const CorsIndexMigration: MigrationDescription = {
  id: 'cors-index',
  after: 'init',
  steps: [
    {
      kind: 'create_index',
      table: 'UserPoolCors',
      schema: 'daita',
      unique: true,
      name: 'url',
      fields: ['url', 'userPoolId'],
    },
  ],
};
