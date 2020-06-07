import { SourceTableDescription } from './source-table';
import { Condition } from './condition';
import { isExactKind } from '@daita/common';

export interface JoinDescription {
  join: 'inner' | 'left' | 'right' | 'full' | 'cross';
  table: SourceTableDescription<any>;
  condition: Condition
}

export const isJoinDescription = (val: any): val is JoinDescription => isExactKind<JoinDescription>(val, ['join', 'table', 'condition']);
