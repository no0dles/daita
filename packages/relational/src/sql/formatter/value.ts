import { FormatHandle, Formatter, FormatType } from './formatter';
import { ValueType } from '../description/value-type';
import { FormatContext } from './format-context';

export class ValueFormatter implements FormatHandle<ValueType> {
  type = [FormatType.Value, FormatType.OrderBy];

  canHandle(param: any): boolean {
    return typeof param === 'string' || typeof param === 'number' || param instanceof Date || typeof param === 'boolean' || param === null || param === undefined;
  }

  handle(param: ValueType, ctx: FormatContext, formatter: Formatter): string {
    return ctx.appendValue(param);
  }

}
