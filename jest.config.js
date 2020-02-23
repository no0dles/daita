module.exports = {
    "collectCoverage": true,
    coverageDirectory: "<rootDir>/coverage/",
    "collectCoverageFrom": [
        "<rootDir>/packages/*/src/**/*.ts",
        "**/node_modules/@daita/**",
        "src/**",
        "!src/**/*.test.ts",
        "!src/**/*.spec.ts"
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
    projects: [
        {
            displayName: 'core',
            testMatch: ["<rootDir>/packages/core/src/**/*.spec.ts"],
            testEnvironment: 'node',
            "transform": {
                "^.+\\.ts$": "ts-jest"
            }
        },
        {
            displayName: 'web',
            testMatch: ["<rootDir>/packages/web/src/**/*.spec.ts"],
            testEnvironment: 'node',
            "transform": {
                "^.+\\.ts$": "ts-jest"
            }
        },
        {
            displayName: 'cli',
            setupFilesAfterEnv: ["jest-extended"],
            testMatch: ["<rootDir>/packages/cli/src/**/*.spec.ts"],
            testEnvironment: 'node',
            "transform": {
                "^.+\\.ts$": "ts-jest"
            }
        },
        {
            displayName: 'web-client',
            testMatch: ["<rootDir>/packages/web-client/src/**/*.spec.ts"],
            testEnvironment: 'jsdom',
            "transform": {
                "^.+\\.ts$": "ts-jest"
            }
        },
        {
            displayName: 'tslint',
            testMatch: ["<rootDir>/packages/tslint/src/**/*.spec.ts"],
            testEnvironment: 'node',
            "transform": {
                "^.+\\.ts$": "ts-jest"
            }
        },
        {
            displayName: 'node-example',
            testMatch: ["<rootDir>/packages/node-example/src/**/*.spec.ts"],
            testEnvironment: 'node',
            "transform": {
                "^.+\\.ts$": "ts-jest"
            }
        }
    ],
};