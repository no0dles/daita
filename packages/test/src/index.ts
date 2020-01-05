import {PostgresAdapterTest} from './adapters/postgres-adapter';
import {testSchema} from './test';
import {SocketAdapterTest} from './adapters/socket-adapter';
import {ApiAdapterTest} from './adapters/api-adapter';

export const testAdapters = [
  new PostgresAdapterTest(process.env.POSTGRES_URI || 'postgres://postgres:postgres@localhost/daita-postgres-test', testSchema),
  new SocketAdapterTest(3003, new PostgresAdapterTest(process.env.POSTGRES_URI || 'postgres://postgres:postgres@localhost/daita-socket-test', testSchema), testSchema),
  new ApiAdapterTest(3002, new PostgresAdapterTest(process.env.POSTGRES_URI || 'postgres://postgres:postgres@localhost/daita-api-test', testSchema), testSchema),
];