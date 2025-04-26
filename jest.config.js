/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
    testEnvironment: 'node',
    present: 'ts-jest',
    verbose: true,
    transform: {
        '^.+\.tsx?$': ['ts-jest', {}],
    },
};
