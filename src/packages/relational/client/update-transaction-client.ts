import { UpdateClient } from './update-client';
import { TransactionClient } from './transaction-client';

export type UpdateTransactionClient = TransactionClient<UpdateClient> &
  UpdateClient;
