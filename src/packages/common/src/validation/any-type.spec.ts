import { typeTest } from './validate.test';

describe('type/any-type', () => {
  typeTest({
    type: { type: 'any' },
    validValues: [false, true, 123, 'true', 'false', 'foo', null, undefined, new Date(), new RegExp('foo'), {}, []],
    invalidValues: [],
    backwardCompatibleTypes: [{ type: 'any' }],
    notBackwardCompatibleTypes: [
      { type: 'number' },
      { type: 'boolean' },
      { type: 'array', itemType: { type: 'any' } },
      { type: 'map', itemType: { type: 'any' } },
      { type: 'object', props: {}, name: 'test' },
      { type: 'string' },
      { type: 'date' },
      { type: 'undefined' },
      { type: 'null' },
    ],
    errorMessage: '',
  });
});
