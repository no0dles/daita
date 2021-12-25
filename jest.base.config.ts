import type { Config } from '@jest/types';

export const baseConfig: Config.InitialOptions = {
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testTimeout: 10000,
  testRegex: 'src/.*.spec.ts',
  testEnvironment: 'node',
  rootDir: '../../..',
  coveragePathIgnorePatterns: ['/tmp/', '/coverage/', '/dist/', '/schemas/', '/node_modules/'],
  moduleNameMapper: {
    '@daita/auth-server': '<rootDir>/src/packages/auth-server/src/index.ts',
    '@daita/auth': '<rootDir>/src/packages/auth/src/index.ts',
    '@daita/browser': '<rootDir>/src/packages/browser/src/index.ts',
    '@daita/cli': '<rootDir>/src/packages/cli/src/index.ts',
    '@daita/common': '<rootDir>/src/packages/common/src/index.ts',
    '@daita/create': '<rootDir>/src/packages/create/src/index.ts',
    '@daita/eslint-config': '<rootDir>/src/packages/eslint-config/src/index.ts',
    '@daita/http': '<rootDir>/src/packages/http/src/index.ts',
    '@daita/http-adapter': '<rootDir>/src/packages/http-adapter/src/index.ts',
    '@daita/http-server': '<rootDir>/src/packages/http-server/src/index.ts',
    '@daita/iwent': '<rootDir>/src/packages/iwent/src/index.ts',
    '@daita/mariadb-adapter': '<rootDir>/src/packages/mariadb-adapter/src/index.ts',
    '@daita/node': '<rootDir>/src/packages/node/src/index.ts',
    '@daita/orm': '<rootDir>/src/packages/orm/src/index.ts',
    '@daita/pg-adapter': '<rootDir>/src/packages/pg-adapter/src/index.ts',
    '@daita/relational': '<rootDir>/src/packages/relational/src/index.ts',
    '@daita/sqlite-adapter': '<rootDir>/src/packages/sqlite-adapter/src/index.ts',
  },
};
