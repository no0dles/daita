import { SimpleFormatContext } from '../relational/sql/formatter';

export class SqliteFormatContext extends SimpleFormatContext {
  constructor() {
    super('?');
  }

  getDataType(type: string): string {
    switch (type) {
      case 'string':
        return 'TEXT';
      case 'number':
        return 'REAL';
      case 'date':
        return 'TEXT';
      case 'boolean':
        return 'INTEGER';
    }

    throw new Error(`unknown data type ${type}`);
  }
}