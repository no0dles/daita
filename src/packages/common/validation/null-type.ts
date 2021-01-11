import { Type } from './type';

export interface NullType {
  type: 'null';
}

export const NullTypeType: Type = {
  type: 'object',
  name: 'NullType',
  props: {
    type: { type: { type: 'string', enum: ['null'] }, required: true },
  },
};
