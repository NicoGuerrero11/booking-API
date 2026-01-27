import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'node',
    extensionsToTreatAsEsm: ['.ts'],
    transform: {
        '^.+\\.ts$': ['ts-jest', { useESM: true }],
    },

    // Clave cuando tu código TS usa imports con ".js" (típico en ESM)
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },

    testMatch: ['**/*.test.ts'],
};

export default config;