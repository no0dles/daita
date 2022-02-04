import { Client } from 'pg';
import { parse } from 'url';
import { decode, unescape } from 'querystring';

export interface ParsedConnectionString {
  host: string;
  port?: number;
  user?: string;
  password?: string;
  database?: string;
  application_name?: string;
  fallback_application_name?: string;
  connect_timeout?: number;
  client_encoding?: string;
  keepalives?: boolean;
  replication?: boolean | string;
  sslmode?: 'disable' | 'allow' | 'prefer' | 'require' | 'verify-ca' | 'verify-full';
  requiressl?: boolean;
  sslcompression?: boolean;
  sslcert?: string;
  sslkey?: string;
  sslpassword?: string;
  sslrootcert?: string;
  sslcrl?: string;
}

export function parseConnectionString(connectionString: string): ParsedConnectionString {
  const parsed = parse(connectionString);
  if (parsed.protocol !== 'postgresql:' && parsed.protocol !== 'postgres:') {
    throw new Error('invalid protocol');
  }

  const query = parsed.query ? decode(parsed.query) : {};
  const getQueryString = (key: string): string | undefined => {
    const value = query[key];
    if (!value) {
      return undefined;
    }
    if (value instanceof Array) {
      return value[0];
    }
    return value;
  };
  const getQueryNumber = (key: string): number | undefined => {
    const value = getQueryString(key);
    if (value) {
      return parseInt(value, 0);
    }
    return undefined;
  };

  let host = parsed.hostname || getQueryString('host');
  let database = parsed.pathname ? parsed.pathname.substr(1) : undefined;
  if (!host && parsed.path?.startsWith('%2F')) {
    const slashIndex = parsed.path?.indexOf('/');
    if (slashIndex > 0) {
      host = unescape(parsed.path?.substr(0, slashIndex));
      database = parsed.path?.substr(slashIndex + 1);
    } else {
      host = unescape(parsed.path);
      database = undefined;
    }
  }

  return {
    host: host || 'localhost',
    port: (parsed.port ? parseInt(parsed.port, 0) : undefined) || getQueryNumber('port'),
    application_name: getQueryString('application_name'),
    connect_timeout: getQueryNumber('connect_timeout'),
    client_encoding: getQueryString('client_encoding'),
    database: database || getQueryString('database'),
    fallback_application_name: getQueryString('fallback_application_name'),
    user: parsed.auth
      ? parsed.auth.indexOf(':') > 0
        ? parsed.auth.substr(0, parsed.auth.indexOf(':'))
        : parsed.auth
      : undefined || getQueryString('user'),
    password: parsed.auth
      ? parsed.auth.indexOf(':') > 0
        ? parsed.auth.substr(parsed.auth.indexOf(':') + 1)
        : undefined
      : undefined || getQueryString('password'),
  };
}

export async function ensureDatabaseExists(connectionString: string): Promise<void>;
export async function ensureDatabaseExists(connectionOptions: ParsedConnectionString): Promise<void>;
export async function ensureDatabaseExists(connectionStringOrOptions: string | ParsedConnectionString): Promise<void> {
  const config =
    typeof connectionStringOrOptions === 'string'
      ? parseConnectionString(connectionStringOrOptions)
      : connectionStringOrOptions;
  const client = await getClient(config);
  try {
    await client.query(`CREATE DATABASE "${config.database}";`);
  } catch (err: any) {
    //42501 permission denied to create database
    //42P04 already exists
    if (err.code !== '42P04' && err.code !== '42501') {
      throw err;
    }
  } finally {
    await client.end();
  }
}

export async function dropDatabase(connectionString: string): Promise<void>;
export async function dropDatabase(connectionOptions: ParsedConnectionString): Promise<void>;
export async function dropDatabase(connectionStringOrOptions: string | ParsedConnectionString): Promise<void> {
  const config =
    typeof connectionStringOrOptions === 'string'
      ? parseConnectionString(connectionStringOrOptions)
      : connectionStringOrOptions;
  const client = await getClient(config);
  try {
    await client.query(`DROP DATABASE "${config.database}";`);
  } catch (err: any) {
    if (err.code !== '3D000') {
      throw err;
    }
  } finally {
    await client.end();
  }
}

async function getClient(config: ParsedConnectionString) {
  const client = new Client({
    host: config.host || undefined,
    port: config.port !== undefined && config.port !== null ? config.port : undefined,
    user: config.user || undefined,
    password: config.password || undefined,
    database: 'postgres',
  });
  await client.connect();
  return client;
}
