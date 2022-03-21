import { SimpleFormatContext } from '@daita/relational';
import { ValueType } from '@daita/relational';

export class MariadbFormatContext extends SimpleFormatContext {
  constructor() {
    super('?', '`');
  }

  appendValue(value: ValueType): string {
    if (value === undefined) {
      this.values.push(null);
    } else {
      this.values.push(value);
    }
    return this.paramKey;
  }

  // getDataType(options: FormatDataType): string {
  //   switch (options.type) {
  //     case 'string':
  //       if (options.size) {
  //         return `VARCHAR(${options.size})`;
  //       }
  //       return 'TEXT';
  //     case 'number':
  //       return 'DECIMAL(26,10)';
  //     case 'date':
  //       return 'DATETIME(3)';
  //     case 'boolean':
  //       return 'BOOLEAN';
  //     case 'uuid':
  //       return 'VARCHAR(36)';
  //     case 'string[]':
  //       return 'JSON';
  //     case 'json':
  //       return 'JSON';
  //   }
  //
  //   throw new Error(`unknown data type ${options.type}`);
  // }
}
