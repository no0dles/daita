module.exports = {
    "collectCoverage": true,
    coverageDirectory: "<rootDir>/coverage/",
    "collectCoverageFrom": [
        "<rootDir>/packages/*/src/**/*.ts",
        "**/node_modules/@daita/**",
        "src/**"
    ],
    "coverageReporters": [
        "json",
        "text-lcov",
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
        "@daita/node-example": "<rootDir>/packages/examples/node-example/src",
    },
    "transform": {
        "^.+\\.ts$": "ts-jest"
    },
    "testRegex": "src/.*.spec.ts"
};