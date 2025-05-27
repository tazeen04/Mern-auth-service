/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
    testEnvironment: 'node',
    present: 'ts-jest',
    verbose: true,
    collectCoverage: true,
    coverageProvider: 'v8',
    collectCoverageFrom: ['src/**/*.ts', '!tests/**', '!**/node_modules/**'],
    transform: {
        '^.+\.tsx?$': ['ts-jest', {}],
    },
};
