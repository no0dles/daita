import { Section } from '../../section';

export const nodeSqliteSections: Section[] = [
  {
    id: 'init',
    snippets: [
      {
        bash: 'npm init @daita',
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
        filename: 'src/models/mountain.ts',
        typescript:
          'export class Mountain {\n' + '  name!: string\n' + '  height!: number\n' + '  firstAscent!: Date\n' + '}',
      },
      {
        filename: 'src/schema.ts',
        typescript:
          "import { RelationalSchema } from '@daita/orm';\n" +
          "import { Mountain } from './models/mountain';\n" +
          '\n' +
          'export const schema = new RelationalSchema();\n' +
          'schema.table(Mountain);',
      },
    ],
  },
  {
    id: 'create-migration',
    title: 'Generate first migration',
    description:
      'After you adding or changing the schema, it is required to update the database schema. ' +
      'This is done by creating a migration using the daita cli',
    snippets: [{ bash: 'npx daita migration:add initial' }],
  },
  {
    id: 'apply-migration',
    title: 'Apply migrations',
    description: 'With the daita cli the generated migrations can be applied to the database.',
    snippets: [
      {
        bash: 'npx daita migration:apply',
      },
    ],
  },
];
