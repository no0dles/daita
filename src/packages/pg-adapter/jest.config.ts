import type { Config } from '@jest/types';
import { baseConfig } from '../../../jest.base.config';

const config: Config.InitialOptions = {
  ...baseConfig,
  displayName: '@daita/pg-adapter',
  roots: ['<rootDir>/src/packages/pg-adapter'],
  modulePaths: ['src/packages/pg-adapter/src'],
};

export default config;
