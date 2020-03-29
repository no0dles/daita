import {RelationalDataAdapter} from './relational-data-adapter';
import {isKind} from '../utils/is-kind';

export interface RelationalTransactionAdapter extends RelationalDataAdapter {
  transaction<T>(
    action: (adapter: RelationalDataAdapter) => Promise<T>,
  ): Promise<T>;
}

export const isRelationalTransactionAdapter = (val: any): val is RelationalTransactionAdapter => isKind<RelationalTransactionAdapter>(val, ['transaction']);