import { RelationalSqlBuilder } from '../adapter/relational-sql-builder';
import { RelationalTableSchemaTableFieldType } from '../schema';

export class PostgresSqlBuilder implements RelationalSqlBuilder {
  getType(type: RelationalTableSchemaTableFieldType): string {
    switch (type) {
      case 'string':
        return 'varchar';
      case 'date':
        return 'date';
      case 'number':
        return 'integer';
      case 'number[]':
        return 'integer[]';
      case 'string[]':
        return 'varchar[]';
      case 'date[]':
        return 'date[]';
      case 'invalid':
        return '';
      case 'boolean':
        return 'bool';
      case 'boolean[]':
        return 'bool[]';
    }
  }
}
