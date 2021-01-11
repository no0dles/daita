import { ObjectType } from './object-type';

export interface BooleanType {
  type: 'boolean';
  enum?: boolean[];
}

export const BooleanTypeType: ObjectType = {
  name: 'BooleanType',
  props: {
    type: { type: { type: 'string', enum: ['boolean'] }, required: true },
    enum: { type: { type: 'array', itemType: { type: 'boolean' } }, required: false },
  },
  type: 'object',
};
