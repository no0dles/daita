module.exports = {
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
    '!tests/**',
    '!src/**/tests/**',
    '!src/docs/**',
    '!src/testing/**',
    '!src/frontends/**',
    '!src/scripts/**',
    '!src/experimental/**',
    '!src/**/*.test.ts',
    '!src/**/*.spec.ts',
  ],
  coverageReporters: ['json', 'html'],
};
