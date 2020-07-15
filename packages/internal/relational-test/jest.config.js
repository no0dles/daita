module.exports = {
    collectCoverage: true,
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        "**/*.ts",
        "node_modules/@daita/pg-adapter/**/*.{ts|js}",
        "!dist/**"
    ],
    coveragePathIgnorePatterns: [
      '/node_modules(?!\\/@daita)/'
    ],
    coverageReporters: ["json", ["lcov", {"projectRoot": "../../"}]],
    //coverageProvider: 'v8',
    moduleFileExtensions: [
        'ts',
        'js',
    ],
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    testRegex: 'src/.*.spec.ts',
    testEnvironment: 'node',
};
