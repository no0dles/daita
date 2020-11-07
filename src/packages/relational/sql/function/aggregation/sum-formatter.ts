import { FormatHandle, Formatter, FormatType } from '../../../formatter/formatter';
import { FormatContext } from '../../../formatter/format-context';
import { isSumDescription, SumDescription } from './sum-description';

export class SumFormatter implements FormatHandle<SumDescription> {
  type = FormatType.Value;

  canHandle(param: any): boolean {
    return isSumDescription(param);
  }

  handle(param: SumDescription, ctx: FormatContext, formatter: Formatter): string {
    return `sum(${formatter.format(param.sum, ctx)})`;
  }
}
