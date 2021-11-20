import { FormatHandle, Formatter, FormatType } from '../../../../formatter/formatter';
import { GreaterThanDescription, isGreaterThanDescription } from './greater-than-description';
import { FormatContext } from '../../../../formatter/format-context';

export class GreaterThanFormatter implements FormatHandle<GreaterThanDescription<any>> {
  type = FormatType.Condition;

  canHandle(param: any): boolean {
    return isGreaterThanDescription(param);
  }

  handle(param: GreaterThanDescription<any>, ctx: FormatContext, formatter: Formatter): string {
    return `${formatter.format(param.greaterThan.left, ctx)} > ${formatter.format(param.greaterThan.right, ctx)}`;
  }
}
