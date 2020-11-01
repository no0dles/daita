import { FormatHandle, Formatter, FormatType } from './formatter';
import { FormatContext } from './format-context';
import { GreaterEqualThanDescription, isGreaterEqualThanDescription } from '../description/greater-equal-than';

export class GreaterEqualThanFormatter implements FormatHandle<GreaterEqualThanDescription<any>> {
  type = FormatType.Condition;

  canHandle(param: any): boolean {
    return isGreaterEqualThanDescription(param);
  }

  handle(param: GreaterEqualThanDescription<any>, ctx: FormatContext, formatter: Formatter): string {
    return `${formatter.format(param.greaterEqualThan.left, ctx)} >= ${formatter.format(
      param.greaterEqualThan.right,
      ctx,
    )}`;
  }
}
