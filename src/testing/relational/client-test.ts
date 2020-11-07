import { TransactionClient } from '../../packages/relational/client/transaction-client';
import { adapterTest } from './adapter-test';
import { RelationalTransactionClient } from '../../packages/relational/client/relational-transaction-client';

export function clientTest(fn: (adapterFn: () => TransactionClient<any>) => void) {
  return adapterTest((adapterFn) => {
    fn(() => new RelationalTransactionClient(adapterFn()));
  });
}
