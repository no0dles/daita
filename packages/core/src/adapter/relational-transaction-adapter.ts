import {RelationalDataAdapter} from './relational-data-adapter';

export interface RelationalTransactionAdapter extends RelationalDataAdapter {
  transaction<T>(
    action: (adapter: RelationalDataAdapter) => Promise<T>,
  ): Promise<T>;
}
