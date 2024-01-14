import type { Config } from '@jest/types';
import { baseConfig } from '../../../jest.base.config';

const config: Config.InitialOptions = {
  ...baseConfig,
  displayName: '@daita/auth-server',
  roots: ['<rootDir>/src/packages/auth-server'],
  modulePaths: ['<rootDir>/src/packages/auth-server/src'],
};

export default config;
