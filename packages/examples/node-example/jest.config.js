module.exports = {
    "moduleFileExtensions": [
        "ts",
        "js"
    ],
    "transform": {
        "^.+\\.ts$": "ts-jest"
    },
    testEnvironment: "node",
    "testRegex": "src/.*.spec.ts",
    globals: {
        'ts-jest': {
            diagnostics: false
        }
    }
};