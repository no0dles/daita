import type { Config } from '@jest/types';
import { baseConfig } from '../../../jest.base.config';

const config: Config.InitialOptions = {
  ...baseConfig,
  name: '@daita/common',
  displayName: '@daita/common',
  roots: ['<rootDir>/src/packages/common'],
  modulePaths: ['src/packages/common/src'],
};

export default config;
