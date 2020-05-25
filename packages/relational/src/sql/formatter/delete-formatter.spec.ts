import { testFormat } from './test/formatter.test';

describe('delete-formatter', () => {
  testFormat({
    query: {
      delete: 'foo',
    },
    expectedFormat: 'DELETE FROM "foo"',
    expectedValues:  [],
  });

  testFormat({
    query: {
      delete: 'foo',
      where: {
        left: 1,
        operand: '!=',
        right: 2,
      },
    },
    expectedFormat: 'DELETE FROM "foo" WHERE $1 != $2',
    expectedValues:  [1, 2],
  });
});
