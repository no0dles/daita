import { Section } from '../../section';

export const aboutSections: Section[] = [
  {
    id: 'about',
    description:
      '\n' +
      'Daita is a set of tools to store and access data in typescript. \n' +
      'Each of which adds functionality and tries to make your application simpler.',
    title: 'About daita',
    sections: [
      {
        id: 'packages',
        title: 'Packages',
        sections: [
          {
            id: 'relational',
            title: 'relational',
            description:
              'There is the relational package that contains all the standard sql syntax and a common interface that each database provider has to provide.',
          },
          {
            id: 'orm',
            title: 'orm',
            description:
              'There is the orm package that contains logic for generating and applying sql migrations with support for schemas, tables, indices and views. \n' +
              'While being able to define permissions and ensure access controls.',
          },
          {
            id: 'cli',
            title: 'cli',
            description:
              'There is the cli package which provides tooling for your source code repository. \n' +
              'It should help you to set up new projects or integrate daita into existing ones, generate orm migrations based on source code as well as applying and undoing those on databases. \n',
          },
        ],
      },
      {
        id: 'adapters',
        title: 'Adapters',
        sections: [
          {
            id: 'pg',
            title: 'postgres',
            description:
              'There is the pg-adapter package that adds support for postgres databases. \n' +
              'Including postgres specific sql syntax.',
          },
          {
            id: 'sqlite',
            title: 'sqlite',
            description: 'There is the sqlite-adapter package that adds support for sqlite databases.',
          },
          {
            id: 'http',
            title: 'http',
            description:
              'There is the http-adapter package that allows access to databases like postgres or sqlite over the web.',
          },
        ],
      },
    ],
  },
];
