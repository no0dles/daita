module.exports = {
    moduleFileExtensions: [
        'ts',
        'js',
    ],
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    testTimeout: 15000,
    testRegex: 'src/.*.spec.ts',
    testEnvironment: 'node',
};
