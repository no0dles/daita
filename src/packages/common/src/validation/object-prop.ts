import { Type, TypeType } from './type';

export interface ObjectProp {
  type: Type;
  required: boolean;
  defaultValue?: any;
}

export const ObjectPropType: Type = {
  type: 'object',
  name: 'ObjectProp',
  props: {
    required: { type: { type: 'boolean' }, required: true },
    defaultValue: { type: { type: 'any' }, required: false },
    type: { type: TypeType, required: true },
  },
};
