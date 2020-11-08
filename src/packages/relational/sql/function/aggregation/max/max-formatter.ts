import { FormatHandle, Formatter, FormatType } from '../../../../formatter/formatter';
import { FormatContext } from '../../../../formatter/format-context';
import { isMaxDescription, MaxDescription } from './max-description';

export class MaxFormatter implements FormatHandle<MaxDescription> {
  type = FormatType.Value;

  canHandle(param: any): boolean {
    return isMaxDescription(param);
  }

  handle(param: MaxDescription, ctx: FormatContext, formatter: Formatter): string {
    return `max(${formatter.format(param.max, ctx)})`;
  }
}
