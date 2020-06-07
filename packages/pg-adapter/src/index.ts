import {
  CreateAdapterOptions, CreateDataAdapterOptions, CreateTransactionAdapterOptions,
  DestroyAdapterOptions, RelationalDataAdapter,
  RelationalDataAdapterFactory, RelationalTransactionAdapter,
  RelationalTransactionAdapterFactory
} from "@daita/relational";
import { PostgresAdapter } from "./adapter/postgres.adapter";
import { parse } from "pg-connection-string";
import { dropDatabase, ensureDatabaseExists } from "./postgres.util";
import { Pool } from "pg";

export { PostgresAdapter } from "./adapter/postgres.adapter";
export { dropDatabase, ensureDatabaseExists } from "./postgres.util";

export const adapterFactory: RelationalDataAdapterFactory & RelationalTransactionAdapterFactory = {
  async createTransactionAdapter(options?: CreateTransactionAdapterOptions): Promise<RelationalTransactionAdapter> {
    const pool = await getPool(options);
    return new PostgresAdapter(pool);
  },
  async createDataAdapter(options?: CreateDataAdapterOptions): Promise<RelationalDataAdapter> {
    const pool = await getPool(options);
    return new PostgresAdapter(pool);
  },
  async destroy(options?: DestroyAdapterOptions): Promise<void> {

  },
  name: "@daita/pg-adapter",
  canCreate(connectionString: string): boolean {
    return connectionString.startsWith("postgres:");
  }
};


async function getPool(options?: CreateAdapterOptions): Promise<Pool> {
  const connectionString = options?.connectionString ?? process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("missing connection string");
  }
  const config = parse(connectionString);
  if (options?.database) {
    config.database = options.database;
  }
  if (options?.dropIfExists) {
    await dropDatabase(config);
  }
  if (options?.createIfNotExists) {
    await ensureDatabaseExists(config);
  }
  return new Pool({
    user: config.user ?? undefined,
    host: config.host ?? undefined,
    port: config.port !== undefined && config.port !== null && config.port !== "" ? parseInt(config.port, 0) : undefined,
    database: config.database ?? undefined,
    ssl: config.ssl !== undefined && config.ssl !== null ? config.ssl === "true" || config.ssl === "1" : undefined,
    password: config.password ?? undefined,
    application_name: config.application_name ?? config.fallback_application_name ?? undefined
  });
}
