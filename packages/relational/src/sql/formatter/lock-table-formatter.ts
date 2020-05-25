import { Formatter, FormatterHandler } from './formatter';
import { FormatContext } from './format-context';
import { isSqlLockTableQuery } from '../dml/lock-table/lock-table-query';

export interface LockTableFormatterOptions {
  lockTableKeyword: string;
}

export class LockTableFormatter implements FormatterHandler {
  constructor(private options: LockTableFormatterOptions) {
  }

  handle(param: any, ctx: FormatContext, formatter: Formatter): string | null {
    if (isSqlLockTableQuery(param)) {
      return `${this.options.lockTableKeyword} ${formatter.format({ table: param.lockTable }, ctx)}`;
    }
    return null;
  }

}
