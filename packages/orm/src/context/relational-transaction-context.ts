import {RelationalDataContext} from './relational-data-context';

export interface RelationalTransactionContext extends RelationalDataContext {
  transaction<T>(action: (trx: RelationalDataContext) => Promise<T>): Promise<T>;
}