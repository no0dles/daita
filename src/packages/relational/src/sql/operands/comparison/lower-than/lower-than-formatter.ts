import { FormatHandle, Formatter, FormatType } from '../../../../formatter/formatter';
import { FormatContext } from '../../../../formatter/format-context';
import { isLowerThanDescription, LowerThanDescription } from './lower-than-description';

export class LowerThanFormatter implements FormatHandle<LowerThanDescription<any>> {
  type = FormatType.Condition;

  canHandle(param: any): boolean {
    return isLowerThanDescription(param);
  }

  handle(param: LowerThanDescription<any>, ctx: FormatContext, formatter: Formatter): string {
    return `${formatter.format(param.lowerThan.left, ctx)} < ${formatter.format(param.lowerThan.right, ctx)}`;
  }
}
