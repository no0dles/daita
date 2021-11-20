import { ObjectType } from '@daita/common/validation/object-type';

export interface IwentContractUpdateEventChange {
  type: 'update_event';
  eventName: string;
  eventType: ObjectType;
  requiresRole?: string;
  requiresAuthentication: boolean;
}
