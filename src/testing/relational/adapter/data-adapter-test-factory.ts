import { DataAdapterTestContext } from './data-adapter-test-context';

export interface DataAdapterTestFactory {
  getAdapter(): Promise<DataAdapterTestContext>;
}
