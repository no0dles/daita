import { IwentContractChange, IwentContractChangeType } from './iwent-contract-change';
import { Type } from '@daita/common';

export interface IwentContract {
  id: string;
  after?: string;
  changes: IwentContractChange[];
}

export const IwentContractType: Type = {
  type: 'object',
  name: 'IwentContract',
  props: {
    id: { type: { type: 'string' }, required: true },
    after: { type: { type: 'string' }, required: false },
    changes: { type: { type: 'array', itemType: IwentContractChangeType }, required: true },
  },
};
