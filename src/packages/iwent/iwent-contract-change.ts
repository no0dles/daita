import { IwentContractRemoveHandlerChange } from './iwent-contract-remove-handler-change';
import { IwentContractAddHandlerChange } from './iwent-contract-add-handler-change';
import { IwentContractAddEventChange, IwentContractAddEventChangeType } from './iwent-contract-add-event-change';
import { IwentContractUpdateEventChange } from './iwent-contract-update-event-change';
import { Type } from '../common/validation/type';

export type IwentContractChange =
  | IwentContractAddEventChange
  | IwentContractAddHandlerChange
  | IwentContractRemoveHandlerChange
  | IwentContractUpdateEventChange;

export const IwentContractChangeType: Type = {
  type: 'union',
  unionTypes: [IwentContractAddEventChangeType],
};
