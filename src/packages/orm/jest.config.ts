import type { Config } from '@jest/types';
import { baseConfig } from '../../../jest.base.config';

const config: Config.InitialOptions = {
  ...baseConfig,
  displayName: '@daita/orm',
  roots: ['<rootDir>/src/packages/orm'],
  modulePaths: ['src/packages/orm/src'],
};

export default config;
