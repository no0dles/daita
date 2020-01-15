import {PostgresAdapterTest} from './adapters/postgres-adapter';
import {testSchema} from './test';
import {SocketAdapterTest} from './adapters/socket-adapter';
import {ApiAdapterTest} from './adapters/api-adapter';

const postgresUri = process.env.POSTGRES_URI || 'postgres://postgres:postgres@localhost';

export const testAdapters = [
  new PostgresAdapterTest(`${postgresUri}/postgres-test`, testSchema),
  new SocketAdapterTest(3003, new PostgresAdapterTest(`${postgresUri}/socket-test`, testSchema), testSchema),
  new ApiAdapterTest(3002, new PostgresAdapterTest(`${postgresUri}/api-test`, testSchema), testSchema),
];