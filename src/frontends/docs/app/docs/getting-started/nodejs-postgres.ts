import { Section } from '../../section';

export const nodePostgresSections: Section[] = [
  {
    id: 'nodejs-sqlite',
    title: 'node.js and sqlite',
    sections: [
      {
        id: 'init',
        snippets: [
          {
            sourceCodes: [
              {
                title: 'bash',
                code: 'npm init @daita',
                type: 'bash',
              },
            ],
          },
        ],
        description: '',
        title: 'Initalize daita',
      },
      {
        id: 'add-table',
        title: 'Add tables',
        snippets: [
          {
            sourceCodes: [
              {
                type: 'typescript',
                title: 'src/models/mountain.ts',
                code:
                  'export class Mountain {\n' +
                  '  name!: string\n' +
                  '  height!: number\n' +
                  '  firstAscent!: Date\n' +
                  '}',
              },
              {
                type: 'typescript',
                title: 'src/schema.ts',
                code:
                  "import { RelationalSchema } from '@daita/orm';\n" +
                  "import { Mountain } from './models/mountain';\n" +
                  '\n' +
                  'export const schema = new RelationalSchema();\n' +
                  'schema.table(Mountain);',
              },
            ],
          },
        ],
      },
      {
        id: 'create-migration',
        title: 'Generate first migration',
        description:
          'After you adding or changing the schema, it is required to update the database schema. ' +
          'This is done by creating a migration using the daita cli',
        snippets: [{ sourceCodes: [{ title: 'bash', type: 'bash', code: 'npx daita migration:add initial' }] }],
      },
      {
        id: 'start-database',
        title: 'Start database (optional)',
        description:
          'The daita cli created during the init a docker compose file with a postgres database. ' +
          'If your already have a running database, this step can be skipped, ' +
          'but make sure the credentials to the database are correct in the daita.json file',
        snippets: [{ sourceCodes: [{ title: 'bash', type: 'bash', code: 'docker-compose up -d' }] }],
      },
      {
        id: 'apply-migration',
        title: 'Apply migrations',
        description: 'With the daita cli the generated migrations can be applied to the database.',
        snippets: [
          {
            sourceCodes: [
              {
                type: 'bash',
                title: 'bash',
                code: 'npx daita migration:apply',
              },
            ],
          },
        ],
      },
    ],
  },
];
