import type { Config } from '@jest/types';
import { baseConfig } from '../../../jest.base.config';

const config: Config.InitialOptions = {
  ...baseConfig,
  displayName: '@daita/mowntain',
  roots: ['<rootDir>/src/examples/mowntain'],
  modulePaths: ['src/examples/mowntain/src'],
};

export default config;
