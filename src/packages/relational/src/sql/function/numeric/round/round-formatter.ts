import { FormatHandle, Formatter, FormatType } from '../../../../formatter/formatter';
import { FormatContext } from '../../../../formatter/format-context';
import { isRoundDescription, RoundDescription } from './round-description';

export class RoundFormatter implements FormatHandle<RoundDescription> {
  type = FormatType.Value;

  canHandle(param: any): boolean {
    return isRoundDescription(param);
  }

  handle(param: RoundDescription, ctx: FormatContext, formatter: Formatter): string {
    if (param.round.precision !== undefined && param.round.precision !== null) {
      return `ROUND(${formatter.format(param.round.value, ctx)}, ${param.round.precision})`;
    } else {
      return `ROUND(${formatter.format(param.round.value, ctx)})`;
    }
  }
}
