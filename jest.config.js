module.exports = {
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage/',
  collectCoverageFrom: [
    'src/**',
    '!dist/**',
    '!src/test/**/*.ts',
    '!src/**/*.test.ts',
    '!src/**/*.spec.ts'
  ],
  coverageReporters: [
    'json',
    'html'
  ],
  roots: [
    '/'
  ],
  moduleNameMapper: {
    '@daita/common': '<rootDir>/packages/common/src',
    '@daita/relational': '<rootDir>/packages/relational/src',
    '@daita/pg-adapter': '<rootDir>/packages/pg-adapter/src',
    '@daita/cli': '<rootDir>/packages/cli/src'
  },
  projects: [
    '<rootDir>/packages/relational',
    '<rootDir>/packages/common',
    '<rootDir>/packages/cli',
    '<rootDir>/packages/pg-adapter'
  ]
};
