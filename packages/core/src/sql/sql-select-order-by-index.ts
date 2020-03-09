import {SqlOrderDirection} from './sql-order-direction';

export interface SqlSelectOrderByIndex {
  index: number;
  direction?: SqlOrderDirection;
}