import { FormatContext } from '../../../../formatter/format-context';
import { FormatHandle, Formatter, FormatType } from '../../../../formatter/formatter';
import { DivideDescription, isDivideDescription } from './divide-description';

export class DivideFormatter implements FormatHandle<DivideDescription> {
  type = FormatType.Value;

  canHandle(param: any): boolean {
    return isDivideDescription(param);
  }

  handle(param: DivideDescription, ctx: FormatContext, formatter: Formatter): string {
    return `${formatter.format(param.divide.left, ctx)} / ${formatter.format(param.divide.right, ctx)}`;
  }
}
