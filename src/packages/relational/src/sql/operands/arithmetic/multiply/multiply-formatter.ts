import { FormatContext } from '../../../../formatter/format-context';
import { FormatHandle, Formatter, FormatType } from '../../../../formatter/formatter';
import { isMultiplyDescription, MultiplyDescription } from './multiply-description';

export class MultiplyFormatter implements FormatHandle<MultiplyDescription> {
  type = FormatType.Value;

  canHandle(param: any): boolean {
    return isMultiplyDescription(param);
  }

  handle(param: MultiplyDescription, ctx: FormatContext, formatter: Formatter): string {
    return `${formatter.format(param.multiply.left, ctx)} * ${formatter.format(param.multiply.right, ctx)}`;
  }
}
