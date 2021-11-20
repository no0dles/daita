import { SourceTableDescription } from '../source-table';
import { ConditionDescription } from '../../../operands/condition-description';
import { isExactKind } from '@daita/common/utils/is-exact-kind';

export interface JoinDescription {
  join: 'inner' | 'left' | 'right' | 'full' | 'cross';
  table: SourceTableDescription<any>;
  condition: ConditionDescription;
}

export const isJoinDescription = (val: any): val is JoinDescription =>
  isExactKind<JoinDescription>(val, ['join', 'table', 'condition']);
