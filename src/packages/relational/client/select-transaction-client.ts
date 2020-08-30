import { SelectClient } from './select-client';
import { TransactionClient } from './transaction-client';

export type SelectTransactionClient = TransactionClient<SelectClient> &
  SelectClient;
