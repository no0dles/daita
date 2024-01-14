import { isExactKind } from '@daita/common';
import { ConditionDescription } from '../../../operands';

export interface CaseWhenDescription {
  caseWhen: { whens: { condition: ConditionDescription; value: any }[]; else?: any };
}

export const isCaseWhenDescription = (val: any): val is CaseWhenDescription =>
  isExactKind<CaseWhenDescription>(val, ['caseWhen']) && val.caseWhen.whens instanceof Array;
