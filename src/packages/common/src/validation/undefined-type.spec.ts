import { validateType } from './validate.test';
import { ValidateStringErrorMessage, ValidateUndefinedErrorMessage } from './validate';
import { isBackwardCompatible } from './backward-compatible';
import { Type } from './type';
import { UndefinedType } from './undefined-type';

describe('type/undefined-type', () => {
  const type: UndefinedType = { type: 'undefined' };
  const validValues = [undefined];
  const invalidValues = [123, 'foo', true, false, null, new Date(), new RegExp('foo'), {}, []];
  const backwardCompatible: Type[] = [
    type,
    {
      type: 'union',
      unionTypes: [type, { type: 'number' }],
    },
    { type: 'any' },
  ];
  const notBackwardCompatible: Type[] = [
    { type: 'number' },
    { type: 'array', itemType: type },
    { type: 'map', itemType: type },
    { type: 'object', props: {}, name: '' },
    { type: 'boolean' },
    { type: 'date' },
    { type: 'string' },
    { type: 'null' },
  ];

  it.each(validValues)('should allow value %s', (val) => {
    validateType(type, val, []);
  });

  it.each(invalidValues)('should not allow value %s', (val) => {
    validateType(type, val, [{ message: ValidateUndefinedErrorMessage, path: [] }]);
  });

  it.each(backwardCompatible)('should be backward compatible %s', (val) => {
    expect(isBackwardCompatible(type, val)).toBeTruthy();
  });
  it.each(notBackwardCompatible)('should be not backward compatible %s', (val) => {
    expect(isBackwardCompatible(type, val)).toBeFalsy();
  });
});
