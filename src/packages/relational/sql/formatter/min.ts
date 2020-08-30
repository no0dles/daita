import { FormatHandle, Formatter, FormatType } from './formatter';
import { isMinDescription, MinDescription } from '../description/min';
import { FormatContext } from './format-context';

export class MinFormatter implements FormatHandle<MinDescription> {
  type = FormatType.Value;

  canHandle(param: any): boolean {
    return isMinDescription(param);
  }

  handle(
    param: MinDescription,
    ctx: FormatContext,
    formatter: Formatter,
  ): string {
    return `min(${formatter.format(param.min, ctx)})`;
  }
}
