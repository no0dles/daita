import { TransactionAdapterTestContext } from './transaction-adapter-test-context';

export interface TransactionAdapterTestFactory {
  getAdapter(): Promise<TransactionAdapterTestContext>;
}
