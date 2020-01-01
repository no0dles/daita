import {Client} from 'pg';
import {parse, ConnectionOptions} from 'pg-connection-string';

export async function ensureDatabaseExists(connectionString: string) {
  const config = parse(connectionString);
  const client = await getClient(config);
  await client.query(`CREATE DATABASE "${config.database}";`).catch(err => {
    if (err.code !== '42P04') {
      throw err;
    }
  });
  await client.end();
}
export async function dropDatabase(connectionString: string) {
  const config = parse(connectionString);
  const client = await getClient(config);
  await client.query(`DROP DATABASE "${config.database}";`).catch(err => {
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
        ? parseInt(config.port)
        : undefined,
    user: config.user || undefined,
    password: config.password || undefined,
    database: 'postgres',
  });
  await client.connect();
  return client;
}
