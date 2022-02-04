import { ObjectType } from './object-type';

export interface DateType {
  type: 'date';
}

export const DateTypeType: ObjectType = {
  name: 'StringType',
  props: {
    type: { type: { type: 'string', enum: ['date'] }, required: true },
  },
  type: 'object',
};
