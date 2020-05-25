import { testFormat } from './test/formatter.test';

describe('create-schema-formatter', () => {
  testFormat({
    query: {
      createSchema: 'foo',
      ifNotExist: true,
    },
    expectedFormat:
      'CREATE SCHEMA IF NOT EXISTS "foo"',
  });
});
