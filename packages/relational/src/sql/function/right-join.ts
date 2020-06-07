import { Condition } from '../description/condition';
import { JoinDescription } from '../description/join';
import { table } from './table';
import { Constructable } from '@daita/common';

export function rightJoin<T, R>(type: Constructable<T>, condition: Condition): JoinDescription {
  return {
    join: 'right',
    table: table(type),
    condition,
  };
}
