import { typeTest } from './validate.test';
import {
  ValidateObjectErrorMessage,
  ValidateObjectMissingPropErrorMessage,
  ValidateObjectUnknownPropErrorMessage,
  ValidateStringErrorMessage,
} from './validate';
import { ObjectType } from './object-type';

describe('type/object-type', () => {
  describe('required prop', () => {
    typeTest({
      type: {
        type: 'object',
        name: 'test',
        props: { foo: { type: { type: 'string' }, required: true } },
      },
      notBackwardCompatibleTypes: [
        {
          type: 'object',
          name: 'test',
          props: { foo: { type: { type: 'number' }, required: true } },
        },
        {
          type: 'object',
          name: 'test',
          props: { bar: { type: { type: 'string' }, required: true } },
        },
      ],
      backwardCompatibleTypes: [
        {
          type: 'object',
          name: 'test',
          props: { foo: { type: { type: 'string' }, required: false } },
        },
        {
          type: 'object',
          name: 'test',
          props: {
            foo: { type: { type: 'string' }, required: true },
            bar: {
              type: { type: 'string' },
              required: true,
              defaultValue: 'val',
            },
          },
        },
      ],
      errorMessage: ValidateStringErrorMessage,
    });
    typeTest({
      type: {
        type: 'object',
        name: 'test',
        props: { foo: { type: { type: 'string' }, required: true } },
      },
      validValues: [{ foo: 'bar' }, { foo: '' }],
      invalidValues: [{ foo: 123 }, { foo: undefined }, { foo: null }],
      errorMessage: ValidateStringErrorMessage,
      errorPath: ['foo'],
    });
    typeTest({
      type: {
        type: 'object',
        name: 'test',
        props: { foo: { type: { type: 'string' }, required: true } },
      },
      invalidValues: [{ foo: '', bar: true }],
      errorMessage: ValidateObjectUnknownPropErrorMessage,
      errorPath: ['bar'],
    });
    typeTest({
      type: {
        type: 'object',
        name: 'test',
        props: { foo: { type: { type: 'string' }, required: true } },
      },
      invalidValues: [{}],
      errorMessage: ValidateObjectMissingPropErrorMessage,
      errorPath: ['foo'],
    });
  });

  describe('nested object', () => {
    const type: ObjectType = {
      name: 'test',
      type: 'object',
      props: { name: { type: { type: 'string' }, required: true } },
    };
    type.props['nested'] = { type, required: false };
    typeTest({
      type,
      validValues: [
        {
          name: 'first',
          nested: {
            name: 'second',
            nested: {
              name: 'third',
            },
          },
        },
      ],
      errorMessage: '',
    });
  });

  describe('optional prop', () => {
    typeTest({
      type: {
        type: 'object',
        name: 'test',
        props: { foo: { type: { type: 'string' }, required: false } },
      },
      validValues: [{ foo: 'bar' }, { foo: '' }, { foo: undefined }],
      invalidValues: [{ foo: 123 }],
      notBackwardCompatibleTypes: [
        {
          type: 'object',
          name: 'test',
          props: {},
        },
        {
          type: 'object',
          name: 'test',
          props: { foo: { type: { type: 'string' }, required: true } },
        },
      ],
      backwardCompatibleTypes: [
        {
          type: 'object',
          name: 'test',
          props: {
            foo: {
              type: { type: 'string' },
              required: true,
              defaultValue: 'bar',
            },
          },
        },
      ],
      errorMessage: ValidateStringErrorMessage,
      errorPath: ['foo'],
    });
  });

  describe('empty object', () => {
    typeTest({
      type: {
        type: 'object',
        name: 'test',
        props: {},
      },
      invalidValues: [{ foo: 'bar' }],
      errorMessage: ValidateObjectUnknownPropErrorMessage,
      errorPath: ['foo'],
    });

    typeTest({
      type: {
        type: 'object',
        name: 'test',
        props: {},
      },
      validValues: [{}],
      invalidValues: [
        true,
        false,
        null,
        undefined,
        new Date(),
        new RegExp('foo'),
        123,
        '1',
        'foo',
        new Map<string, any>(),
        [],
      ],
      errorMessage: ValidateObjectErrorMessage,
      backwardCompatibleTypes: [
        {
          type: 'object',
          name: 'test',
          props: {},
        },
        {
          type: 'object',
          name: 'test',
          props: { foo: { type: { type: 'string' }, required: false } },
        },
        {
          type: 'union',
          unionTypes: [
            {
              type: 'object',
              name: 'test',
              props: {},
            },
            { type: 'string' },
          ],
        },
        { type: 'map', itemType: { type: 'string' } },
        { type: 'any' },
      ],
      notBackwardCompatibleTypes: [
        {
          type: 'object',
          name: 'test',
          props: { foo: { type: { type: 'string' }, required: true } },
        },
        { type: 'string' },
        { type: 'array', itemType: { type: 'string' } },
        { type: 'boolean' },
        { type: 'date' },
        { type: 'undefined' },
        { type: 'null' },
      ],
    });
  });
});
