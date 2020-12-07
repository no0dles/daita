import { Section } from '../../section';

export const nodePostgresSections: Section[] = [
  {
    id: 'nodejs-postgres',
    description:
      '\n' +
      '\n' +
      '```\n' +
      'npm init @daita\n' +
      '```\n' +
      '\n' +
      '\n' +
      '## setup schema / model\n' +
      '\n' +
      'create your first model\n' +
      '\n' +
      '``src/models/mountain.ts``\n' +
      '```typescript\n' +
      'export class Mountain {\n' +
      '  name!: string\n' +
      '  height!: number\n' +
      '  firstAscent!: Date\n' +
      '}\n' +
      '``` \n' +
      '\n' +
      '\n' +
      'add your model to the schema\n' +
      '\n' +
      '``src/schema.ts``\n' +
      '```typescript\n' +
      "import {RelationalSchema} from '@daita/orm'; \n" +
      "import { Mountain } from './models/mountain';\n" +
      '\n' +
      'export const schema = new RelationalSchema();\n' +
      'schema.table(Mountain);\n' +
      '``` \n' +
      '\n' +
      '\n' +
      'create a migration for your schema changes\n' +
      '```shell script\n' +
      'npx daita migration:add initial\n' +
      '```\n' +
      '\n' +
      '\n' +
      '\n' +
      '## node with sqlite\n' +
      '\n' +
      'apply migrations to the database\n' +
      '```shell script\n' +
      'npx daita migration:apply\n' +
      '```\n' +
      '\n' +
      '## node with postgres\n' +
      '\n' +
      'start your database\n' +
      '```shell script\n' +
      'docker-compuse up -d\n' +
      '```\n' +
      '\n' +
      'apply migrations to the database\n' +
      '```shell script\n' +
      'npx daita migration:apply\n' +
      '```\n' +
      '\n' +
      '## web with sqlite over http\n' +
      '\n' +
      'apply migrations to the database\n' +
      '```shell script\n' +
      'npx daita migration:apply\n' +
      '```\n',
    title: 'Node.js with postgres',
  },
];
