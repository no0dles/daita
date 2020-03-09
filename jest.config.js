module.exports = {
    "collectCoverage": true,
    coverageDirectory: "<rootDir>/coverage/",
    "collectCoverageFrom": [
        "<rootDir>/packages/*/src/**/*.ts",
        "**/node_modules/@daita/**",
        "src/**",
        "!src/test/**/*.ts",
        "!src/**/*.test.ts",
        "!src/**/*.spec.ts"
    ],
    "coverageReporters": [
        "json",
        "html"
    ],
    roots: [
        'packages/'
    ],
    "moduleFileExtensions": [
        "ts",
        "js"
    ],
    moduleNameMapper: {
        "@daita/core": "<rootDir>/packages/core/src",
        "@daita/web": "<rootDir>/packages/web/src",
        "@daita/web-client": "<rootDir>/packages/web-client/src",
        "@daita/tslint": "<rootDir>/packages/tslint/src",
        "@daita/cli": "<rootDir>/packages/cli/src",
        "@daita/pg": "<rootDir>/packages/pg/src",
        "@daita/mongodb": "<rootDir>/packages/mongodb/src",
        "@daita/node-example": "<rootDir>/packages/examples/node-example/src",
    },
    projects: [
        '<rootDir>/packages/core',
        '<rootDir>/packages/web',
        '<rootDir>/packages/cli',
        '<rootDir>/packages/pg',
        '<rootDir>/packages/mongodb',
        '<rootDir>/packages/tslint',
        '<rootDir>/packages/examples/node-example',
        '<rootDir>/packages/web-client',
    ],
};