import { ObjectType } from './object-type';

export interface StringType {
  type: 'string';
  enum?: string[];
}

export const StringTypeType: ObjectType = {
  name: 'StringType',
  props: {
    type: { type: { type: 'string', enum: ['string'] }, required: true },
    enum: { type: { type: 'array', itemType: { type: 'string' } }, required: false },
  },
  type: 'object',
};
