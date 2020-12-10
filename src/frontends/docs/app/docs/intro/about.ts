import { Section } from '../../section';

export const aboutSections: Section[] = [
  {
    id: 'about',
    description:
      '\n' +
      'Daita is a set of tools to store and access data in typescript. \n' +
      'Each of which adds functionality and tries to make your application simpler. \n' +
      '\n' +
      'There is the <a href="/packages/relational">relational</a> package that contains all the standard sql syntax and a common interface that each database provider has to provide.\n' +
      '\n' +
      'There is the [orm](/docs/@daita/orm) package that contains logic for generating and applying sql migrations with support for schemas, tables, indices and views. \n' +
      'While being able to define permissions and ensure access controls.\n' +
      '\n' +
      'There is the [cli](/docs/@daita/cli) package which provides tooling for your source code repository. \n' +
      'It should help you to set up new projects or integrate daita into existing ones, generate orm migrations based on source code as well as applying and undoing those on databases. \n' +
      '\n' +
      'There is the [pg-adapter](/docs/@daita/pg-adapter) package that adds support for postgres databases. \n' +
      'Including postgres specific sql syntax.\n' +
      '\n' +
      'There is the [sqlite-adapter](/docs/@daita/sqlite-adapter) package that adds support for sqlite databases.\n' +
      '\n' +
      'There is the [http-adapter](/docs/@daita/http-adapter) package that allows access to databases like postgres or sqlite over the web. \n',
    title: 'About daita',
  },
];
