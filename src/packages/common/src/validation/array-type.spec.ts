import { typeTest } from './validate.test';
import { ArrayType } from './array-type';
import { ValidateArrayErrorMessage, ValidateStringErrorMessage } from './validate';

describe('type/array-type', () => {
  const type: ArrayType = { type: 'array', itemType: { type: 'string' } };
  typeTest({
    type,
    validValues: [[['foo']], [['foo', 'bar']]],
    invalidValues: [null, undefined, false, true, 'foo', 123, NaN, {}, new Date(), new RegExp('a')],
    backwardCompatibleTypes: [
      type,
      { type: 'any' },
      {
        type: 'array',
        itemType: {
          type: 'union',
          unionTypes: [{ type: 'string' }, { type: 'number' }],
        },
      },
      { type: 'union', unionTypes: [type, { type: 'number' }] },
      { type: 'array', itemType: { type: 'any' } },
    ],
    notBackwardCompatibleTypes: [
      { type: 'number' },
      { type: 'boolean' },
      { type: 'array', itemType: { type: 'number' } },
      { type: 'map', itemType: type },
      { type: 'object', props: {}, name: 'test' },
      { type: 'string' },
      { type: 'date' },
      { type: 'undefined' },
      { type: 'null' },
    ],
    errorMessage: ValidateArrayErrorMessage,
  });

  typeTest({
    type,
    invalidValues: [[[1]], [[new Date()]]],
    errorMessage: ValidateStringErrorMessage,
    errorPath: ['0'],
  });
});
