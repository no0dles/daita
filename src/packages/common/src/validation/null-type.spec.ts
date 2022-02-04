import { validateType } from './validate.test';
import { ValidateNullErrorMessage } from './validate';
import { isBackwardCompatible } from './backward-compatible';
import { Type } from './type';
import { NullType } from './null-type';

describe('type/null-type', () => {
  const type: NullType = { type: 'null' };
  const validValues = [null];
  const invalidValues = [123, 'foo', true, false, undefined, new Date(), new RegExp('foo'), {}, []];
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
    { type: 'boolean' },
    { type: 'date' },
    { type: 'string' },
    { type: 'undefined' },
  ];

  it.each(validValues)('should allow value %s', (val) => {
    validateType(type, val, []);
  });

  it.each(invalidValues)('should not allow value %s', (val) => {
    validateType(type, val, [{ message: ValidateNullErrorMessage, path: [] }]);
  });

  it.each(backwardCompatible)('should be backward compatible %s', (val) => {
    expect(isBackwardCompatible(type, val)).toBeTruthy();
  });
  it.each(notBackwardCompatible)('should be not backward compatible %s', (val) => {
    expect(isBackwardCompatible(type, val)).toBeFalsy();
  });
});
