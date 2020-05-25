import { testFormat } from './test/formatter.test';

describe('alias-formatter', () => {
  testFormat({
    query: { alias: { name: 'test', value: 'foo' } },
    expectedFormat: 'foo AS "test"',
    expectedValues: [],
  });
});
