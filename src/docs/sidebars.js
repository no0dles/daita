module.exports = {
  someSidebar: {
    General: ['daita/about-daita', 'daita/getting-started', 'daita/faq', 'daita/design-goals', 'daita/roadmap'],
    '@daita/orm': [
      //   'orm/modelling',
      'packages/orm/migrations',
    ],
    '@daita/relational': [
      'packages/relational/client',
      {
        type: 'category',
        label: 'SQL',
        items: [
          {
            type: 'category',
            label: 'DML Queries',
            items: [
              // 'packages/relational/sql/queries/select',
              // 'packages/relational/sql/queries/insert',
              // 'packages/relational/sql/queries/update',
              // 'packages/relational/sql/queries/delete',
            ],
          },
          {
            type: 'category',
            label: 'DDL Queries',
            items: [
              // 'packages/relational/sql/queries/create-schema',
              // 'packages/relational/sql/queries/create-table',
              // 'packages/relational/sql/queries/drop-schema',
              // 'packages/relational/sql/queries/drop-table',
              // 'packages/relational/sql/ddl/alter-table/alter-table',
            ],
          },
          {
            type: 'category',
            label: 'Functions',
            items: [
              // 'packages/relational/keyword/alias',
              // 'packages/relational/function/aggregation/all',
              // 'packages/relational/keyword/and',
              // 'packages/relational/sql/function/avg',
              // 'packages/relational/sql/function/between',
              // 'packages/relational/sql/function/concat',
              // 'packages/relational/sql/aggregation/count',
              // 'packages/relational/sql/function/equal',
              // 'packages/relational/sql/function/exists',
              // 'packages/relational/keyword/field',
              // 'packages/relational/sql/function/greaterThan',
              // 'packages/relational/sql/function/greaterEqualThan',
              // 'packages/relational/sql/function/in',
              // 'packages/relational/sql/function/isNull',
              // 'packages/relational/sql/function/isNotNull',
              // 'packages/relational/sql/function/join',
              // 'packages/relational/operand/comparision/leftJoin',
              // 'packages/relational/operand/comparision/like',
              // 'packages/relational/operand/comparision/lowerThan',
              // 'packages/relational/operand/comparision/lowerEqualThan',
              // 'packages/relational/sql/function/max',
              // 'packages/relational/sql/function/min',
              // 'packages/relational/sql/function/notBetween',
              // 'packages/relational/operand/comparision/notEqual',
              // 'packages/relational/operand/comparision/notIn',
              // 'packages/relational/sql/function/now',
              // 'packages/relational/keyword/or',
              // 'packages/relational/sql/function/rightJoin',
              // 'packages/relational/sql/function/subSelect',
              // 'packages/relational/function/aggregation/sum',
              // 'packages/relational/keyword/table',
            ],
          },
        ],
      },
      {
        type: 'category',
        label: 'Adapters',
        items: [
          'packages/relational/adapters/pg',
          'packages/relational/adapters/sqlite',
          'packages/relational/adapters/mock',
        ],
      },
      'packages/relational/testing',
    ],
    '@daita/cli': ['packages/cli/migration', 'packages/cli/serve', 'packages/cli/version', 'packages/cli/help'],
    // 'Data Adapters': ['data-adapters/postgres', 'data-adapters/sqlite', 'data-adapters/websocket', 'data-adapters/rest'],
  },
};
