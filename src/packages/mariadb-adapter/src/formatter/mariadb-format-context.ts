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
}
