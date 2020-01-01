export interface RelationalTableSchemaTableReferenceKey {
  table: string;
  name: string;
  keys: string[];
  foreignKeys: string[];
}
