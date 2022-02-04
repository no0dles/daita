import { SubtractDescription, isSubtractDescription } from './subtract-description';
import { FormatContext } from '../../../../formatter/format-context';
import { FormatHandle, Formatter, FormatType } from '../../../../formatter/formatter';

export class SubtractFormatter implements FormatHandle<SubtractDescription> {
  type = FormatType.Value;

  canHandle(param: any): boolean {
    return isSubtractDescription(param);
  }

  handle(param: SubtractDescription, ctx: FormatContext, formatter: Formatter): string {
    return `${formatter.format(param.subtract.left, ctx)} - ${formatter.format(param.subtract.right, ctx)}`;
  }
}
