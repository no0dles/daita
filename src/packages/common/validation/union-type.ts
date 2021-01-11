import { Type, TypeType } from './type';
import { ObjectType } from './object-type';

export interface UnionType {
  type: 'union';
  unionTypes: Type[];
}

export const UnionTypeType: ObjectType = {
  name: 'UnionType',
  props: {
    type: { type: { type: 'string', enum: ['union'] }, required: true },
    unionTypes: { type: { type: 'array', itemType: TypeType }, required: true },
  },
  type: 'object',
};
