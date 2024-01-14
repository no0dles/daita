import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  testTimeout: 25000,
  collectCoverage: true,
  collectCoverageFrom: ['src/**'],
  coverageDirectory: '<rootDir>/coverage/',
  coverageReporters: ['json', 'html', 'lcov'],
  globalTeardown: '<rootDir>/jest.teardown.ts',
  projects: [
    '<rootDir>/src/packages/auth-server/jest.config.ts',
    '<rootDir>/src/packages/cli/jest.config.ts',
    '<rootDir>/src/packages/node/jest.config.ts',
    '<rootDir>/src/packages/orm/jest.config.ts',
    '<rootDir>/src/packages/relational/jest.config.ts',
    '<rootDir>/src/packages/pg-adapter/jest.config.ts',
    '<rootDir>/src/packages/common/jest.config.ts',
    '<rootDir>/src/examples/mowntain/jest.config.ts',
    //'<rootDir>/src/tooling/npm/jest.config.ts',
  ],
};

export default config;
