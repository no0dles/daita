import { FormatHandle, Formatter, FormatType } from './formatter';
import { CountDescription, isCountDescription } from '../description/count';
import { FormatContext } from './format-context';

export class CountFormatter implements FormatHandle<CountDescription> {
  type = FormatType.Value;

  canHandle(param: any): boolean {
    return isCountDescription(param);
  }

  handle(
    param: CountDescription,
    ctx: FormatContext,
    formatter: Formatter,
  ): string {
    if (param.count.field) {
      const prefix = param.count.distinct ? 'DISTINCT ' : '';
      return `count(${prefix}${formatter.format(param.count.field, ctx)})`;
    } else {
      return `count(*)`;
    }
  }
}
