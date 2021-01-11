import { ObjectType } from './object-type';

export interface AnyType {
  type: 'any';
}

export const AnyTypeType: ObjectType = {
  name: 'AnyType',
  props: {
    type: { type: { type: 'string', enum: ['any'] }, required: true },
  },
  type: 'object',
};
