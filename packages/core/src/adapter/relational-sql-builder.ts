import { RelationalTableSchemaTableFieldType } from '../schema';

export interface RelationalSqlBuilder {
  getType(type: RelationalTableSchemaTableFieldType): string;
}
