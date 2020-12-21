import { AppAuthorization } from './app-authorization';
import { isTransactionContext, TransactionContext } from '../orm/context/transaction-context';
import { Context } from '../orm/context/context';
import { RelationalMigrationAdapter } from '../orm/adapter/relational-migration-adapter';
import { MigrationContext } from '../orm/context/get-migration-context';

export interface AppOptions {
  context: MigrationContext<any>;
  enableTransactions: boolean;
  transactionTimeout?: number;
  cors?: boolean | string | string[];
  authorization: AppAuthorization | false;
}
