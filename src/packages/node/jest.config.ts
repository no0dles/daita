import type { Config } from '@jest/types';
import { baseConfig } from '../../../jest.base.config';

const config: Config.InitialOptions = {
  ...baseConfig,
  displayName: '@daita/node',
  roots: ['<rootDir>/src/packages/node'],
  modulePaths: ['src/packages/node/src'],
};

export default config;
