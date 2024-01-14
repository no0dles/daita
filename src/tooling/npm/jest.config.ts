import type { Config } from '@jest/types';
import { baseConfig } from '../../../jest.base.config';

const config: Config.InitialOptions = {
  ...baseConfig,
  name: '@daita/npm',
  displayName: '@daita/npm',
  roots: ['<rootDir>/src/tooling/npm'],
  modulePaths: ['src/tooling/npm/src'],
};

export default config;
