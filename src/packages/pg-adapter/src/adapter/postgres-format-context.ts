import { CounterFormatContext } from '@daita/relational';
import { ValueType } from '@daita/relational';

export class PostgresFormatContext extends CounterFormatContext {
  constructor() {
    super('$');
  }

  appendValue(value: ValueType): string {
    const result = super.appendValue(value ?? null);
    if (typeof value === 'number') {
      return `${result}::NUMERIC(26,10)`;
    } else {
      return result;
    }
  }

  // getDataType(options: FormatDataType): string {
  //   // TODO support size
  //   switch (options.type) {
  //     case 'string':
  //       return 'VARCHAR';
  //     case 'number':
  //       return 'NUMERIC(26,10)';
  //     case 'date':
  //       return 'TIMESTAMPTZ';
  //     case 'boolean':
  //       return 'BOOLEAN';
  //     case 'json':
  //       return 'JSONB';
  //     case 'number[]':
  //       return 'NUMERIC(26,10)[]';
  //     case 'string[]':
  //       return 'VARCHAR[]';
  //     case 'boolean[]':
  //       return 'BOOLEAN[]';
  //     case 'uuid':
  //       return 'uuid';
  //   }
  //
  //   throw new Error(`unknown data type ${options.type}`);
  // }
}
