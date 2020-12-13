import { Section } from '../../section';

export const nodeSqliteSections: Section[] = [
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
];
