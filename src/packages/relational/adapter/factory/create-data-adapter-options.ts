import { CreateAdapterOptions } from './create-adapter-options';
import { RelationalDataAdapterPackage } from './relational-data-adapter-package';
import { isKind } from '../../../common/utils';

export interface CreateDataAdapterOptionsMultiple extends CreateAdapterOptions {
  adapters: RelationalDataAdapterPackage[];
}

export interface CreateDataAdapterOptionsSingle extends CreateAdapterOptions {
  adapter: RelationalDataAdapterPackage;
}

export type CreateDataAdapterOptions =
  | CreateDataAdapterOptionsMultiple
  | CreateDataAdapterOptionsSingle;

export const isCreateDataAdapterOptionsSingle = (
  val: any,
): val is CreateDataAdapterOptionsSingle => isKind(val, ['adapter']);
