import { ObjectType } from '@daita/common';

export interface IwentContractUpdateEventChange {
  type: 'update_event';
  eventName: string;
  eventType: ObjectType;
  requiresRole?: string;
  requiresAuthentication: boolean;
}
