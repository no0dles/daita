import { CreateAdapterOptions } from './create-adapter-options';
import { RelationalTransactionAdapterPackage } from './relational-transaction-adapter-package';
import { isKind } from '../../../common/utils';

export type CreateTransactionAdapterOptions =
  | CreateTransactionAdapterOptionsMultiple
  | CreateTransactionAdapterOptionsSingle;

export interface CreateTransactionAdapterOptionsMultiple
  extends CreateAdapterOptions {
  adapters: RelationalTransactionAdapterPackage[];
}

export interface CreateTransactionAdapterOptionsSingle
  extends CreateAdapterOptions {
  adapter: RelationalTransactionAdapterPackage;
}

export const isCreateTransactionAdapterOptionsSingle = (
  val: any,
): val is CreateTransactionAdapterOptionsSingle => isKind(val, ['adapter']);
