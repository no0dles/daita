import { validateType } from './validate.test';
import { ValidateBooleanErrorMessage } from './validate';
import { isBackwardCompatible } from './backward-compatible';
import { Type } from './type';
import { BooleanType } from './boolean-type';

describe('type/boolean-type', () => {
  const type: BooleanType = { type: 'boolean' };
  const validValues = [false, true];
  const invalidValues = [123, 'true', 'false', 'foo', null, undefined, new Date(), new RegExp('foo'), {}, []];
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
    { type: 'object', props: {}, name: 'test' },
    { type: 'string' },
    { type: 'date' },
    { type: 'undefined' },
    { type: 'null' },
  ];

  it.each(validValues)('should allow value %s', (val) => {
    validateType(type, val, []);
  });

  it.each(invalidValues)('should not allow value %s', (val) => {
    validateType(type, val, [{ message: ValidateBooleanErrorMessage, path: [] }]);
  });

  it.each(backwardCompatible)('should be backward compatible %s', (val) => {
    expect(isBackwardCompatible(type, val)).toBeTruthy();
  });
  it.each(notBackwardCompatible)('should be not backward compatible %s', (val) => {
    expect(isBackwardCompatible(type, val)).toBeFalsy();
  });
});
