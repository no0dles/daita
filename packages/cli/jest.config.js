module.exports = {
    setupFilesAfterEnv: ['jest-extended'],
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
