import { FormatHandle, Formatter, FormatType } from '../../../../formatter/formatter';
import { EqualDescription, isEqualDescription } from './equal-description';
import { FormatContext } from '../../../../formatter/format-context';

export class EqualFormatter implements FormatHandle<EqualDescription<any>> {
  type = FormatType.Condition;

  canHandle(param: any): boolean {
    return isEqualDescription(param);
  }

  handle(param: EqualDescription<any>, ctx: FormatContext, formatter: Formatter): string {
    return `${formatter.format(param.equal.left, ctx)} = ${formatter.format(param.equal.right, ctx)}`;
  }
}
