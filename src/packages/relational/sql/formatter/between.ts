import { FormatHandle, Formatter, FormatType } from './formatter';
import { FormatContext } from './format-context';
import { BetweenDescription, isBetweenDescription } from '../description';

export class BetweenFormatter implements FormatHandle<BetweenDescription<any>> {
  type = FormatType.Condition;

  canHandle(param: any): boolean {
    return isBetweenDescription(param);
  }

  handle(
    param: BetweenDescription<any>,
    ctx: FormatContext,
    formatter: Formatter,
  ): string {
    return `${formatter.format(
      param.between.value,
      ctx,
    )} BETWEEN ${formatter.format(
      param.between.min,
      ctx,
    )} AND ${formatter.format(param.between.max, ctx)}`;
  }
}
