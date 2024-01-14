import { FormatHandle, Formatter, FormatType } from '../../../../formatter/formatter';
import { isMinDescription, MinDescription } from './min-description';
import { FormatContext } from '../../../../formatter/format-context';

export class MinFormatter implements FormatHandle<MinDescription> {
  type = FormatType.Value;

  canHandle(param: any): boolean {
    return isMinDescription(param);
  }

  handle(param: MinDescription, ctx: FormatContext, formatter: Formatter): string {
    return `min(${formatter.format(param.min, ctx)})`;
  }
}
