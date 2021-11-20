import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  globals: {
    'ts-jest': './tsconfig.json',
  },
  testRegex: 'src/.*.spec.ts',
  testEnvironment: 'node',
};

export default config;
