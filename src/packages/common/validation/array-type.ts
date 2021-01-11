import { Type, TypeType } from './type';
import { ObjectType } from './object-type';

export interface ArrayType {
  type: 'array';
  itemType: Type;
}

export const ArrayTypeType: ObjectType = {
  name: 'ArrayType',
  props: {
    type: { type: { type: 'string', enum: ['array'] }, required: true },
    itemType: { type: TypeType, required: true },
  },
  type: 'object',
};
