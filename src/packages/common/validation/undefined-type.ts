import { Type } from './type';

export interface UndefinedType {
  type: 'undefined';
}

export const UndefinedTypeType: Type = {
  type: 'object',
  name: 'UndefinedType',
  props: {
    type: { type: { type: 'string', enum: ['undefined'] }, required: true },
  },
};
