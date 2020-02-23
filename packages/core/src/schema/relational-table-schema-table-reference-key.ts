export interface RelationalTableSchemaTableReferenceKey {
  table: string;
  name: string;
  keys: string[];
  required: boolean;
  foreignKeys: string[];
}
