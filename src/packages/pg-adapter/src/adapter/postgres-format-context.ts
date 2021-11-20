import { CounterFormatContext } from '@daita/relational';
import { FormatDataType } from '@daita/relational';
import { ValueType } from '@daita/relational';

export class PostgresFormatContext extends CounterFormatContext {
  constructor() {
    super('$');
  }

  appendValue(value: ValueType): string {
    return super.appendValue(value ?? null);
  }

  getDataType(options: FormatDataType): string {
    // TODO support size
    switch (options.type) {
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
      case 'number[]':
        return 'NUMERIC(26,10)[]';
      case 'string[]':
        return 'VARCHAR[]';
      case 'boolean':
        return 'BOOLEAN[]';
      case 'uuid':
        return 'uuid';
    }

    throw new Error(`unknown data type ${options.type}`);
  }
}
