import { RelationalAdapterFactory } from "./relational-adapter-factory";
import { isKind } from "@daita/common";
import { RelationalDataAdapter } from "../relational-data-adapter";
import { CreateAdapterOptions } from "./create-adapter-options";

export interface RelationalDataAdapterFactory extends RelationalAdapterFactory {
  createDataAdapter(options?: CreateAdapterOptions): Promise<RelationalDataAdapter>;
}

export const isRelationalDataAdapterFactory = (val: any): val is RelationalDataAdapterFactory => isKind(val, ["createDataAdapter", "destroy"]);
