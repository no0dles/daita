import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  setupFilesAfterEnv: ['jest-extended'],
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testTimeout: 25000,
  testRegex: 'src/.*.spec.ts',
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage/',
  collectCoverageFrom: [
    'src/**',
    '!dist/**',
    '!coverage/**',
    '!tmp/**',
    '!src/docs/**',
    '!src/testing/**',
    '!src/frontends/**',
    '!src/scripts/**',
    '!src/experimental/**',
    '!src/**/*.test.ts',
    '!src/**/*.spec.ts',
  ],
  globalTeardown: '<rootDir>/jest.teardown.ts',
  coverageReporters: ['json', 'html', 'lcov'],
};

export default config;
