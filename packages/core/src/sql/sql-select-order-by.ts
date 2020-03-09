import {SqlSelectOrderByField} from './sql-select-order-by-field';
import {SqlSelectOrderByIndex} from './sql-select-order-by-index';

export type SqlSelectOrderBy =
  number | SqlSelectOrderByIndex | SqlSelectOrderByField;