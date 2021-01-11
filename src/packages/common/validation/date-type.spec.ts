import { validateType } from './validate.test';
import { ValidateDateErrorMessage } from './validate';
import { isBackwardCompatible } from './backward-compatible';
import { Type } from './type';
import { DateType } from './date-type';

describe('type/date-type', () => {
  const type: DateType = { type: 'date' };
  const validValues = [new Date()];
  const invalidValues = [123, true, false, null, undefined, new RegExp('foo'), {}, []];
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
    { type: 'string' },
    { type: 'undefined' },
    { type: 'null' },
  ];

  it.each(validValues)('should allow value %s', (val) => {
    validateType(type, val, []);
  });

  it.each(invalidValues)('should not allow value %s', (val) => {
    validateType(type, val, [{ message: ValidateDateErrorMessage, path: [] }]);
  });

  it.each(backwardCompatible)('should be backward compatible %s', (val) => {
    expect(isBackwardCompatible(type, val)).toBeTruthy();
  });
  it.each(notBackwardCompatible)('should be not backward compatible %s', (val) => {
    expect(isBackwardCompatible(type, val)).toBeFalsy();
  });
});
