import { ValidateUnknownTypeErrorMessage } from './validate';
import { validateType } from './validate.test';

describe('validate', () => {
  it('should fail for not valid type', () => {
    validateType({ type: 'something' } as any, 123, [{ message: ValidateUnknownTypeErrorMessage, path: [] }]);
  });
});
