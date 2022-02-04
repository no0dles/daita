import { FormatHandle, Formatter, FormatType } from '../../../../formatter/formatter';
import { FormatContext } from '../../../../formatter/format-context';
import { AvgDescription, isAvgDescription } from './avg-description';

export class AvgFormatter implements FormatHandle<AvgDescription> {
  type = FormatType.Value;

  canHandle(param: any): boolean {
    return isAvgDescription(param);
  }

  handle(param: AvgDescription, ctx: FormatContext, formatter: Formatter): string {
    return `avg(${formatter.format(param.avg, ctx)})`;
  }
}
