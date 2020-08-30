import { FormatHandle, Formatter, FormatType } from './formatter';
import { GreaterThanDescription, isGreaterThanDescription } from '../description/greater-than';
import { FormatContext } from './format-context';

export class GreaterThanFormatter implements FormatHandle<GreaterThanDescription<any>> {
  type = FormatType.Condition;

  canHandle(param: any): boolean {
    return isGreaterThanDescription(param);
  }

  handle(param: GreaterThanDescription<any>, ctx: FormatContext, formatter: Formatter): string {
    return `${formatter.format(param.greaterThan.left, ctx)} > ${formatter.format(param.greaterThan.right, ctx)}`;
  }
}
