import { getClient, TransactionClient } from '../packages/relational/client';
import { postgresAdapter } from '../packages/pg-adapter';

export type TestCaseCallback = (client: TransactionClient<any>) => void;

export function clientTest(name: string, fn: TestCaseCallback): () => void;
export function clientTest(fn: TestCaseCallback): () => void;
export function clientTest(
  nameOrFn: string | TestCaseCallback,
  fn?: TestCaseCallback,
): () => void {
  if (typeof nameOrFn === 'string') {
    const client = getClient(postgresAdapter, {
      connectionString:
        process.env.DATABASE_URL ||
        `postgres://postgres:postgres@localhost:5432/${nameOrFn}`,
      dropIfExists: true,
    });
    return () => {
      fn!(client);
    };
  } else {
    const client = getClient(postgresAdapter, {
      connectionString:
        process.env.DATABASE_URL ||
        'postgres://postgres:postgres@localhost:5432/test',
      dropIfExists: true,
    });
    return () => {
      nameOrFn(client);
    };
  }
}
