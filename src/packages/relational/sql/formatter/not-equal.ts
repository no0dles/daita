import { FormatHandle, Formatter, FormatType } from './formatter';
import { FormatContext } from './format-context';
import { isNotEqualDescription, NotEqualDescription } from '../description/not-equal';

export class NotEqualFormatter implements FormatHandle<NotEqualDescription<any>> {
  type = FormatType.Condition;

  canHandle(param: any): boolean {
    return isNotEqualDescription(param);
  }

  handle(param: NotEqualDescription<any>, ctx: FormatContext, formatter: Formatter): string {
    return `${formatter.format(param.notEqual.left, ctx)} != ${formatter.format(param.notEqual.right, ctx)}`;
  }
}
