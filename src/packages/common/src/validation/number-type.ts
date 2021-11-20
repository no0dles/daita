import { ObjectType } from './object-type';

export interface NumberType {
  type: 'number';
  enum?: number[];
}

export const NumberTypeType: ObjectType = {
  name: 'NumberType',
  props: {
    type: { type: { type: 'string', enum: ['number'] }, required: true },
    enum: { type: { type: 'array', itemType: { type: 'number' } }, required: false },
  },
  type: 'object',
};
