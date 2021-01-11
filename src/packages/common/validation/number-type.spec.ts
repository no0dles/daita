import { validateType } from './validate.test';
import { ValidateNumberErrorMessage } from './validate';
import { isBackwardCompatible } from './backward-compatible';
import { Type } from './type';
import { NumberType } from './number-type';

describe('type/number-type', () => {
  const type: NumberType = { type: 'number' };
  const validValues = [-12, 0, 2.3, 1000, 1000000000];
  const invalidValues = [true, false, null, undefined, new Date(), new RegExp('foo'), '1', 'foo', {}, []];
  const backwardCompatible: Type[] = [
    type,
    {
      type: 'union',
      unionTypes: [type, { type: 'string' }],
    },
    { type: 'any' },
  ];
  const notBackwardCompatible: Type[] = [
    { type: 'string' },
    { type: 'array', itemType: type },
    { type: 'map', itemType: type },
    { type: 'object', props: {}, name: 'test' },
    { type: 'boolean' },
    { type: 'date' },
    { type: 'undefined' },
    { type: 'null' },
  ];

  it.each(validValues)('should allow value %s', (val) => {
    validateType(type, val, []);
  });

  it.each(invalidValues)('should not allow value %s', (val) => {
    validateType(type, val, [{ message: ValidateNumberErrorMessage, path: [] }]);
  });

  it.each(backwardCompatible)('should be backward compatible %s', (val) => {
    expect(isBackwardCompatible(type, val)).toBeTruthy();
  });
  it.each(notBackwardCompatible)('should be not backward compatible %s', (val) => {
    expect(isBackwardCompatible(type, val)).toBeFalsy();
  });
});
