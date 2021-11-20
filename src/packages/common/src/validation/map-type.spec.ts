import {typeTest} from './validate.test';
import {
  ValidateMapErrorMessage,
  ValidateStringErrorMessage,
} from './validate';
import {MapType} from './map-type';

describe('type/map-type', () => {
  const type: MapType = {type: 'map', itemType: {type: 'string'}};
  typeTest({
    type,
    invalidValues: [{foo: 123}],
    errorMessage: ValidateStringErrorMessage,
    errorPath: ['foo'],
  });

  typeTest({
    validValues: [{'123': 'foo', bar: '123'}, {}, {1: 'foo', 2: 'bar'}],
    invalidValues: [
      123,
      'foo',
      true,
      false,
      null,
      undefined,
      new Date(),
      new RegExp('foo'),
      [],
      ['foo'],
    ],
    backwardCompatibleTypes: [
      type,
      {
        type: 'union',
        unionTypes: [type, {type: 'number'}],
      },
      {type: 'any'},
    ],
    notBackwardCompatibleTypes: [
      {type: 'number'},
      {type: 'array', itemType: type},
      {type: 'object', name: 'test', props: {}},
      {
        type: 'object', name: 'test',
        props: {foo: {type: {type: 'string'}, required: false}},
      },
      {type: 'boolean'},
      {type: 'date'},
      {type: 'string'},
      {type: 'null'},
      {type: 'undefined'},
    ],
    type,
    errorMessage: ValidateMapErrorMessage,
  });
});
