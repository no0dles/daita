import { FormatDataType } from '../formatter/format-context';
import { TransactionClient } from '../client/transaction-client';

export interface StorageOptions {
  idType: FormatDataType;
  transactionClient: TransactionClient<any>;
}
