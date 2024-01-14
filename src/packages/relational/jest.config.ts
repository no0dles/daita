import type { Config } from '@jest/types';
import { baseConfig } from '../../../jest.base.config';

const config: Config.InitialOptions = {
  ...baseConfig,
  displayName: '@daita/relational',
  roots: ['<rootDir>/src/packages/relational'],
  modulePaths: ['src/packages/relational/src'],
};

export default config;
