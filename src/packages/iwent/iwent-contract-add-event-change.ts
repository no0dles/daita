import { ObjectType, ObjectTypeType } from '../common/validation/object-type';
import { Type } from '../common/validation/type';

export interface IwentContractAddEventChange {
  type: 'add_event';
  eventName: string;
  eventType: ObjectType;
  requiresRole?: string;
  requiresAuthentication: boolean;
}

export const IwentContractAddEventChangeType: Type = {
  type: 'object',
  name: 'IwentContractAddEventChange',
  props: {
    type: { type: { type: 'string' }, required: true },
    eventName: { type: { type: 'string' }, required: true },
    eventType: { type: ObjectTypeType, required: true },
  },
};
