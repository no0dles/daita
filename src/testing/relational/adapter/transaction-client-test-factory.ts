import { TransactionClientTestContext } from './transaction-client-test-context';

export interface TransactionClientTestFactory {
  getClient(): Promise<TransactionClientTestContext>;
}
