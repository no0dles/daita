import {
  getFieldFromSchemaTable,
  SchemaTableDescription,
  SchemaTableReferenceDescription,
} from './relational-schema-description';

export function isTableReferenceRequiredInTable(
  table: SchemaTableDescription,
  reference: SchemaTableReferenceDescription,
) {
  return !reference.keys.some((k) => !getFieldFromSchemaTable(table, k.field).required);
}
