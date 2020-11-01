import { FormatHandle, Formatter, FormatType } from './formatter';
import { FormatContext } from './format-context';
import { AvgDescription, isAvgDescription } from '../description/avg';

export class AvgFormatter implements FormatHandle<AvgDescription> {
  type = FormatType.Value;

  canHandle(param: any): boolean {
    return isAvgDescription(param);
  }

  handle(param: AvgDescription, ctx: FormatContext, formatter: Formatter): string {
    return `avg(${formatter.format(param.avg, ctx)})`;
  }
}
