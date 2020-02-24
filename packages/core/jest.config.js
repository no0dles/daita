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
    globals: {
        'ts-jest': {
            diagnostics: false
        }
    }
};