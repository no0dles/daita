import { Condition } from '../description/condition';
import { JoinDescription } from '../description/join';
import { table } from './table';
import { Constructable } from '@daita/common';

export function leftJoin<T, R>(type: Constructable<T>, condition: Condition): JoinDescription {
  return {
    join: 'left',
    table: table(type),
    condition,
  };
}


