import { Type } from './type';
import { ObjectProp, ObjectPropType } from './object-prop';

export interface ObjectType {
  type: 'object';
  name: string;
  props: { [key: string]: ObjectProp };
}

export const ObjectTypeType: Type = {
  type: 'object',
  name: 'ObjectType',
  props: {
    type: { type: { type: 'string', enum: ['object'] }, required: true },
    name: { type: { type: 'string' }, required: true },
    props: { type: { type: 'map', itemType: ObjectPropType }, required: true },
  },
};
