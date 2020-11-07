import { CounterFormatContext } from '../../relational/formatter/counter-format-context';

export class PostgresFormatContext extends CounterFormatContext {
  constructor() {
    super('$');
  }

  getDataType(type: string): string {
    switch (type) {
      case 'string':
        return 'VARCHAR';
      case 'number':
        return 'NUMERIC(26,10)';
      case 'date':
        return 'TIMESTAMPTZ';
      case 'boolean':
        return 'BOOLEAN';
      case 'json':
        return 'JSONB';
    }

    throw new Error(`unknown data type ${type}`);
  }
}
