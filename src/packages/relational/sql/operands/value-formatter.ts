import { FormatHandle, Formatter, FormatType } from '../../formatter/formatter';
import { ValueType } from './value-type';
import { FormatContext } from '../../formatter/format-context';
import { isJsonDescription } from '../../types/json/json-description';

export class ValueFormatter implements FormatHandle<ValueType> {
  type = [FormatType.Value, FormatType.OrderBy];

  canHandle(param: any): boolean {
    return (
      typeof param === 'string' ||
      typeof param === 'number' ||
      param instanceof Date ||
      typeof param === 'boolean' ||
      param === null ||
      param === undefined ||
      isJsonDescription(param)
    );
  }

  handle(param: ValueType, ctx: FormatContext, formatter: Formatter): string {
    if (isJsonDescription(param)) {
      return ctx.appendValue(param.json.value);
    } else {
      return ctx.appendValue(param);
    }
  }
}
