import { RelationalAdapterFactory } from "./relational-adapter-factory";
import { RelationalTransactionAdapter } from "../relational-transaction-adapter";
import { CreateAdapterOptions } from "./create-adapter-options";
import {isKind} from '../../../common/utils';

export interface RelationalTransactionAdapterFactory extends RelationalAdapterFactory {
  createTransactionAdapter(options?: CreateAdapterOptions): Promise<RelationalTransactionAdapter>;
}

export const isRelationalTransactionAdapterFactory = (val: any): val is RelationalTransactionAdapterFactory => isKind(val, ["createTransactionAdapter", "destroy"]);
