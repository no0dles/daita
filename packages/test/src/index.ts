import {PostgresAdapterTest} from './adapters/postgres-adapter';
import {testSchema} from './test';
import {SocketAdapterTest} from './adapters/socket-adapter';

export const testAdapters = [
  new PostgresAdapterTest(process.env.POSTGRES_URI || 'postgres://postgres:postgres@localhost/daita-postgres-test', testSchema),
  new SocketAdapterTest(3003, new PostgresAdapterTest(process.env.POSTGRES_URI || 'postgres://postgres:postgres@localhost/daita-socket-test', testSchema), testSchema),
];