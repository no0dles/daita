import {
  CreateAdapterOptions, CreateDataAdapterOptions, CreateMigrationAdapterOptions, CreateTransactionAdapterOptions,
  DestroyAdapterOptions,
  RelationalDataAdapter,
  RelationalDataAdapterFactory, RelationalMigrationAdapter, RelationalMigrationAdapterFactory,
  RelationalTransactionAdapterFactory
} from "@daita/relational";
import { PostgresAdapter } from "./postgres.adapter";
import { parse } from "pg-connection-string";
import { dropDatabase, ensureDatabaseExists } from "./postgres.util";
import { Pool } from "pg";

export { PostgresAdapter } from "./postgres.adapter";
export { dropDatabase, ensureDatabaseExists } from "./postgres.util";

export const adapterFactory: RelationalDataAdapterFactory & RelationalTransactionAdapterFactory & RelationalMigrationAdapterFactory = {
  async createMigrationAdapter(options?: CreateDataAdapterOptions): Promise<RelationalMigrationAdapter> {
    const pool = await getPool(options);
    return new PostgresAdapter(pool);
  },
  async createTransactionAdapter(options?: CreateTransactionAdapterOptions): Promise<RelationalMigrationAdapter> {
    const pool = await getPool(options);
    return new PostgresAdapter(pool);
  },
  async createDataAdapter(options?: CreateMigrationAdapterOptions): Promise<RelationalMigrationAdapter> {
    const pool = await getPool(options);
    return new PostgresAdapter(pool);
  },
  async destroy(options?: DestroyAdapterOptions): Promise<void> {

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
    port: config.port !== undefined && config.port !== null && config.port !== '' ? parseInt(config.port, 0) : undefined,
    database: config.database ?? undefined,
    ssl: config.ssl !== undefined && config.ssl !== null ? config.ssl === 'true' || config.ssl === '1' : undefined,
    password: config.password ?? undefined,
    application_name: config.application_name ?? config.fallback_application_name ?? undefined,
  });
}
