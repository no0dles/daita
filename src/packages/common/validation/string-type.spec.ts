import { StringType } from './string-type';
import { typeTest } from './validate.test';
import { ValidateStringEnumErrorMessage, ValidateStringErrorMessage } from './validate';

describe('type/string-type', () => {
  const type: StringType = { type: 'string' };

  typeTest({
    type: { type: 'string', enum: ['foo', 'bar'] },
    validValues: ['foo', 'bar'],
    invalidValues: ['', 'foobar'],
    errorMessage: ValidateStringEnumErrorMessage,
  });

  typeTest({
    type,
    validValues: ['foo'],
    invalidValues: [123, true, false, null, undefined, new Date(), new RegExp('foo'), {}, []],
    backwardCompatibleTypes: [
      type,
      {
        type: 'union',
        unionTypes: [type, { type: 'number' }],
      },
      { type: 'any' },
    ],
    notBackwardCompatibleTypes: [
      { type: 'number' },
      { type: 'array', itemType: type },
      { type: 'map', itemType: type },
      { type: 'object', props: {}, name: 'test' },
      { type: 'boolean' },
      { type: 'date' },
      { type: 'undefined' },
      { type: 'null' },
    ],
    errorMessage: ValidateStringErrorMessage,
  });
});
