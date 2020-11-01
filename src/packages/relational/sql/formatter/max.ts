import { FormatHandle, Formatter, FormatType } from './formatter';
import { FormatContext } from './format-context';
import { isMaxDescription, MaxDescription } from '../description/max';

export class MaxFormatter implements FormatHandle<MaxDescription> {
  type = FormatType.Value;

  canHandle(param: any): boolean {
    return isMaxDescription(param);
  }

  handle(param: MaxDescription, ctx: FormatContext, formatter: Formatter): string {
    return `max(${formatter.format(param.max, ctx)})`;
  }
}
