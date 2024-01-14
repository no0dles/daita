import { FormatHandle, Formatter, FormatType } from '../../../../formatter/formatter';
import { FormatContext } from '../../../../formatter/format-context';
import { isLowerEqualThanDescription, LowerEqualThanDescription } from './lower-equal-than-description';

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
