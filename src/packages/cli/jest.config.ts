import type { Config } from '@jest/types';
import { baseConfig } from '../../../jest.base.config';

const config: Config.InitialOptions = {
  ...baseConfig,
  name: '@daita/cli',
  displayName: '@daita/cli',
  roots: ['<rootDir>/src/packages/cli'],
  modulePaths: ['src/packages/cli/src'],
};

export default config;
