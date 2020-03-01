import {RelationalSqlBuilder} from '@daita/core/dist/adapter/relational-sql-builder';
import {RelationalTableSchemaTableFieldType} from '@daita/core';

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
      case 'boolean':
        return 'bool';
      case 'boolean[]':
        return 'bool[]';
    }
  }
}
