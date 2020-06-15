module.exports = {
    collectCoverage: true,
    coverageDirectory: '<rootDir>/coverage/',
    collectCoverageFrom: [
        '<rootDir>/packages/*/src/**/*.ts',
        '**/node_modules/@daita/**',
        'src/**',
        '!src/test/**/*.ts',
        '!src/**/*.test.ts',
        '!src/**/*.spec.ts',
    ],
    coverageReporters: [
        'json',
        'html',
    ],
    roots: [
        'packages/',
    ],
    moduleNameMapper: {
        '@daita/common': '<rootDir>/packages/common/src',
        '@daita/relational': '<rootDir>/packages/relational/src',
        '@daita/pg': '<rootDir>/packages/pg-adapter/src',
        '@daita/cli': '<rootDir>/packages/cli/src',
        // '@daita/mongodb': '<rootDir>/packages/mongodb/src',
        // '@daita/node-example': '<rootDir>/packages/examples/node-example/src',
    },
    projects: [
        '<rootDir>/packages/relational',
        '<rootDir>/packages/common',
        '<rootDir>/packages/cli',
    ],
};
