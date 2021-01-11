import { Type, TypeType } from './type';
import { ObjectType } from './object-type';

export interface MapType {
  type: 'map';
  itemType: Type;
}

export const MapTypeType: ObjectType = {
  name: 'MapType',
  props: {
    type: { type: { type: 'string', enum: ['map'] }, required: true },
    itemType: { type: TypeType, required: true },
  },
  type: 'object',
};
