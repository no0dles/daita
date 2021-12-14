import { typeTest } from './validate.test';
import { ValidateUnionErrorMessage } from './validate';

describe('type/union-type', () => {
  typeTest({
    type: {
      type: 'union',
      unionTypes: [{ type: 'string' }, { type: 'number' }],
    },
    validValues: [1, 'test'],
    invalidValues: [true, false, null, undefined, new Date(), new RegExp('foo'), new Map<string, any>(), [], {}],
    errorMessage: ValidateUnionErrorMessage,
  });
});
