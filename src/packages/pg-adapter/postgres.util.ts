import { Client } from 'pg';
import { parse, ConnectionOptions } from 'pg-connection-string';

export async function ensureDatabaseExists(
  connectionString: string,
): Promise<void>;
export async function ensureDatabaseExists(
  connectionOptions: ConnectionOptions,
): Promise<void>;
export async function ensureDatabaseExists(
  connectionStringOrOptions: string | ConnectionOptions,
): Promise<void> {
  const config =
    typeof connectionStringOrOptions === 'string'
      ? parse(connectionStringOrOptions)
      : connectionStringOrOptions;
  const client = await getClient(config);
  await client.query(`CREATE DATABASE "${config.database}";`).catch((err) => {
    //42501 permission denied to create database
    //42P04 already exists
    if (err.code !== '42P04' && err.code !== '42501') {
      throw err;
    }
  });
  await client.end();
}

export async function dropDatabase(connectionString: string): Promise<void>;
export async function dropDatabase(
  connectionOptions: ConnectionOptions,
): Promise<void>;
export async function dropDatabase(
  connectionStringOrOptions: string | ConnectionOptions,
): Promise<void> {
  const config =
    typeof connectionStringOrOptions === 'string'
      ? parse(connectionStringOrOptions)
      : connectionStringOrOptions;
  const client = await getClient(config);
  await client.query(`DROP DATABASE "${config.database}";`).catch((err) => {
    if (err.code !== '3D000') {
      throw err;
    }
  });
  await client.end();
}

async function getClient(config: ConnectionOptions) {
  const client = new Client({
    host: config.host || undefined,
    port:
      config.port !== undefined && config.port !== null
        ? parseInt(config.port, 0)
        : undefined,
    user: config.user || undefined,
    password: config.password || undefined,
    database: 'postgres',
  });
  await client.connect();
  return client;
}
