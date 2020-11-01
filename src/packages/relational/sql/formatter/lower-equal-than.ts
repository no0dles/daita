import { FormatHandle, Formatter, FormatType } from './formatter';
import { FormatContext } from './format-context';
import { isLowerEqualThanDescription, LowerEqualThanDescription } from '../description/lower-equal-than';

export class LowerEqualThanFormatter implements FormatHandle<LowerEqualThanDescription<any>> {
  type = FormatType.Condition;

  canHandle(param: any): boolean {
    return isLowerEqualThanDescription(param);
  }

  handle(param: LowerEqualThanDescription<any>, ctx: FormatContext, formatter: Formatter): string {
    return `${formatter.format(param.lowerEqualThan.left, ctx)} <= ${formatter.format(
      param.lowerEqualThan.right,
      ctx,
    )}`;
  }
}
