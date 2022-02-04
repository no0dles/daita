import { FormatHandle, Formatter, FormatType } from '../../../../formatter/formatter';
import { FormatContext } from '../../../../formatter/format-context';
import { isNotEqualDescription, NotEqualDescription } from './not-equal-description';

export class NotEqualFormatter implements FormatHandle<NotEqualDescription<any>> {
  type = FormatType.Condition;

  canHandle(param: any): boolean {
    return isNotEqualDescription(param);
  }

  handle(param: NotEqualDescription<any>, ctx: FormatContext, formatter: Formatter): string {
    return `${formatter.format(param.notEqual.left, ctx)} != ${formatter.format(param.notEqual.right, ctx)}`;
  }
}
