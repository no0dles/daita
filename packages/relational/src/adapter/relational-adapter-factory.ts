import { RelationalDataAdapter } from "./relational-data-adapter";
import { RelationalTransactionAdapter } from "./relational-transaction-adapter";
import { RelationalMigrationAdapter } from "./relational-migration-adapter";
import { isKind } from "@daita/common";

export interface RelationalDataAdapterFactory {
  createDataAdapter(options?: CreateAdapterOptions): Promise<RelationalDataAdapter>;

  destroy(options?: DestroyAdapterOptions): Promise<void>;
}

export const isRelationalDataAdapterFactory = (val: any): val is RelationalDataAdapterFactory => isKind(val, ["createDataAdapter", "destroy"]);

export interface RelationalTransactionAdapterFactory {
  createTransactionAdapter(options?: CreateAdapterOptions): Promise<RelationalTransactionAdapter>;

  destroy(options?: DestroyAdapterOptions): Promise<void>;
}

export const isRelationalTransactionAdapterFactory = (val: any): val is RelationalTransactionAdapterFactory => isKind(val, ["createTransactionAdapter", "destroy"]);

export interface RelationalMigrationAdapterFactory {
  createMigrationAdapter(options?: CreateAdapterOptions): Promise<RelationalMigrationAdapter>;

  destroy(options?: DestroyAdapterOptions): Promise<void>;
}

export const isRelationalMigrationAdapterFactory = (val: any): val is RelationalMigrationAdapterFactory => isKind(val, ["createMigrationAdapter", "destroy"]);

export interface RelationalDataAdapterPackage {
  adapterFactory: RelationalDataAdapterFactory;
}

export interface RelationalTransactionAdapterPackage {
  adapterFactory: RelationalTransactionAdapterFactory;
}

export interface RelationalMigrationAdapterPackage {
  adapterFactory: RelationalMigrationAdapterFactory;
}

export interface DestroyAdapterOptions {
  database?: string;
}

export interface CreateAdapterOptions {
  connectionString?: string;
  database?: string;
  dropIfExists?: boolean;
  createIfNotExists?: boolean;
}

export interface CreateDataAdapterOptions extends CreateAdapterOptions {
  adapter?: RelationalDataAdapterPackage;
}

export interface CreateTransactionAdapterOptions extends CreateAdapterOptions {
  adapter?: RelationalTransactionAdapterPackage;
}

export interface CreateMigrationAdapterOptions extends CreateAdapterOptions {
  adapter?: RelationalMigrationAdapterPackage;
}

export function createDataAdapter(options?: CreateDataAdapterOptions) {
  if (options?.adapter) {
    return options.adapter.adapterFactory.createDataAdapter(options);
  }
  const adapter = detectAdapter();
  if (!isRelationalDataAdapterFactory(adapter)) {
    throw new Error("Adapter is no data adapter");
  }
  return adapter.createDataAdapter(options);
}

export function createTransactionAdapter(options?: CreateTransactionAdapterOptions) {
  if (options?.adapter) {
    return options.adapter.adapterFactory.createTransactionAdapter(options);
  }
  const adapter = detectAdapter();
  if (!isRelationalTransactionAdapterFactory(adapter)) {
    throw new Error("Adapter is no transaction adapter");
  }
  return adapter.createTransactionAdapter(options);
}

export function createMigrationAdapter(options?: CreateMigrationAdapterOptions) {
  if (options?.adapter) {
    return options.adapter.adapterFactory.createMigrationAdapter(options);
  }
  const adapter = detectAdapter();
  if (!isRelationalMigrationAdapterFactory(adapter)) {
    throw new Error("Adapter is no migration adapter");
  }
  return adapter.createMigrationAdapter(options);
}

function detectAdapter(): any {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("use DATABASE_URL env or specify adapter");
  }

  const connectionStrings: { [key: string]: string } = {
    "postgres:": "@daita/pg-adapter"
  };

  for (const key in connectionStrings) {
    if (!databaseUrl.startsWith(key)) {
      continue;
    }

    try {
      const adapter = require(connectionStrings[key]);
      return adapter.adapterFactory;
    } catch (e) {
      console.error("Missing @daita/pg-adapter, try npm i @daita/pg-adapter");
      process.exit(1);
    }
  }

  throw new Error("unknown DATABASE");
}
