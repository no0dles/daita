import { FormatHandle, Formatter, FormatType } from '../../../../formatter/formatter';
import { FormatContext } from '../../../../formatter/format-context';
import { InDescription, isInDescription } from './in-description';

export class InFormatter implements FormatHandle<InDescription<any>> {
  type = FormatType.Condition;

  canHandle(param: any): boolean {
    return isInDescription(param);
  }

  handle(param: InDescription<any>, ctx: FormatContext, formatter: Formatter): string {
    return `${formatter.format(param.in.field, ctx)} IN (${param.in.values
      .map((value) => formatter.format(value, ctx))
      .join(', ')})`;
  }
}
