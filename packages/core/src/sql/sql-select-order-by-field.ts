import {SqlSchemaTableField} from './sql-schema-table-field';
import {SqlOrderDirection} from './sql-order-direction';

export interface SqlSelectOrderByField extends SqlSchemaTableField {
  direction?: SqlOrderDirection;
}