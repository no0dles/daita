module.exports = {
    "moduleFileExtensions": [
        "ts",
        "js"
    ],
    "transform": {
        "^.+\\.ts$": "ts-jest"
    },
    "testRegex": "src/.*.spec.ts",
    testEnvironment: "node",
    maxConcurrency: 1,
    globals: {
        'ts-jest': {
            diagnostics: false
        }
    }
};