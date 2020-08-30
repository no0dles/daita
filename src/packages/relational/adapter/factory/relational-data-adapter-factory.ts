import { RelationalAdapterFactory } from "./relational-adapter-factory";
import { RelationalDataAdapter } from "../relational-data-adapter";
import { CreateAdapterOptions } from "./create-adapter-options";
import {isKind} from '../../../common/utils';

export interface RelationalDataAdapterFactory extends RelationalAdapterFactory {
  createDataAdapter(options?: CreateAdapterOptions): Promise<RelationalDataAdapter>;
}

export const isRelationalDataAdapterFactory = (val: any): val is RelationalDataAdapterFactory => isKind(val, ["createDataAdapter", "destroy"]);
