import { Constructable } from '@daita/common';
import { Condition } from '../description/condition';
import { JoinDescription } from '../description/join';
import { table } from './table';

export function join<T, R>(type: Constructable<T>, condition: Condition): JoinDescription {
  return {
    join: 'inner',
    table: table(type),
    condition,
  };
}
