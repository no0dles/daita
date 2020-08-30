import { RuleTester } from '@typescript-eslint/experimental-utils/dist/ts-eslint';
import rule from './ban-import';
import * as path from 'path';

const ruleTester = new RuleTester({
  parser: path.resolve('@typescript-eslint/parser'),
});

describe('ban-import', () => {
  ruleTester.run('ban-import', rule, {
    valid: [
      {
        code: `import * as foo from '@daita/core';`,
      },
    ],
    invalid: [
      {
        code: `import Foo from '@daita/core/dist/foo'`,
        errors: [
          {
            messageId: 'bannedImport',
            line: 1,
            column: 1,
          },
        ],
      },
    ],
  });
});
