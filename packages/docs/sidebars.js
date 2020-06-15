module.exports = {
  someSidebar: {
    General: [
      'daita/about-daita',
      'daita/getting-started',
      'daita/installation',
      'daita/roadmap',
      'daita/faq'
    ],
    '@daita/relational': [
      'relational/client',
      {
        type: 'category',
        label: 'SQL',
        items: [
          {
            type: 'category',
            label: 'DML Queries',
            items: [
              'relational/sql/queries/select',
              'relational/sql/queries/insert',
              'relational/sql/queries/update',
              'relational/sql/queries/delete',
            ]
          },
          {
            type: 'category',
            label: 'DDL Queries',
            items: [
              'relational/sql/queries/create-schema',
              'relational/sql/queries/create-table',
              'relational/sql/queries/drop-schema',
              'relational/sql/queries/drop-table',
              'relational/sql/queries/alter-table'
            ]
          },
          {
            type: 'category',
            label: 'Functions',
            items: [
              'relational/sql/functions/alias',
              'relational/sql/functions/all',
              'relational/sql/functions/and',
              'relational/sql/functions/avg',
              'relational/sql/functions/between',
              'relational/sql/functions/concat',
              'relational/sql/functions/count',
              'relational/sql/functions/equal',
              'relational/sql/functions/exists',
              'relational/sql/functions/field',
              'relational/sql/functions/greaterThan',
              'relational/sql/functions/greaterEqualThan',
              'relational/sql/functions/in',
              'relational/sql/functions/isNull',
              'relational/sql/functions/isNotNull',
              'relational/sql/functions/join',
              'relational/sql/functions/leftJoin',
              'relational/sql/functions/like',
              'relational/sql/functions/lowerThan',
              'relational/sql/functions/lowerEqualThan',
              'relational/sql/functions/max',
              'relational/sql/functions/min',
              'relational/sql/functions/notBetween',
              'relational/sql/functions/notEqual',
              'relational/sql/functions/notIn',
              'relational/sql/functions/now',
              'relational/sql/functions/or',
              'relational/sql/functions/rightJoin',
              'relational/sql/functions/subSelect',
              'relational/sql/functions/sum',
              'relational/sql/functions/table',
            ]
          }
        ]
      },
      {
        type: 'category',
        label: 'Adapters',
        items: [
          'relational/adapters/pg',
          'relational/adapters/sqlite',
          'relational/adapters/mock'
        ]
      },
      'relational/testing'
    ],
    '@daita/orm': [
    //   'orm/modelling',
       'orm/migrations'
    ],
    '@daita/cli': [
      'cli/migration',
      'cli/serve',
      'cli/version',
      'cli/help'
    ],
    // 'Data Adapters': ['data-adapters/postgres', 'data-adapters/sqlite', 'data-adapters/websocket', 'data-adapters/rest'],
  }
};
