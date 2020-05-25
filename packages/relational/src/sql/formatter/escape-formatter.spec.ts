import { testFormat } from './test/formatter.test';

describe('escape-formatter', () => {
  testFormat({
    expectedFormat: '"test"',
    expectedValues: [],
    query: { escape: 'test' },
  });
});
