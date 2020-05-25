import { SqlOrderDirection } from './sql-order-direction';
import { SqlSchemaTableField } from '../../sql-schema-table-field';

export interface SqlSelectOrderByField extends SqlSchemaTableField {
  direction?: SqlOrderDirection;
}
