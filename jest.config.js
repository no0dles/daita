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
  testTimeout: 15000,
  moduleNameMapper: {
    '@daita/common': '<rootDir>/packages/common/dist',
    '@daita/relational': '<rootDir>/packages/relational/dist',
    '@daita/orm': '<rootDir>/packages/orm/dist',
    '@daita/pg-adapter': '<rootDir>/packages/pg-adapter/dist',
    '@daita/sqlite-adapter': '<rootDir>/packages/sqlite-adapter/dist',
    '@daita/http-adapter': '<rootDir>/packages/http/http-adapter/dist',
    '@daita/cli': '<rootDir>/packages/cli/dist'
  },
  projects: [
    '<rootDir>/packages/relational',
    '<rootDir>/packages/common',
    '<rootDir>/packages/cli',
    '<rootDir>/packages/pg-adapter',
    '<rootDir>/packages/internal/relational-test'
  ]
};
