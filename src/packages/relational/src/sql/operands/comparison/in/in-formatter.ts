import { FormatHandle, Formatter, FormatType } from '../../../../formatter/formatter';
import { FormatContext } from '../../../../formatter/format-context';
import { InDescription, isInDescription } from './in-description';

export class InFormatter implements FormatHandle<InDescription<any>> {
  type = FormatType.Condition;

  canHandle(param: any): boolean {
    return isInDescription(param);
  }

  handle(param: InDescription<any>, ctx: FormatContext, formatter: Formatter): string {
    if (param.in.values instanceof Array) {
      return `${formatter.format(param.in.field, ctx)} IN (${param.in.values
        .map((value) => formatter.format(value, ctx))
        .join(', ')})`;
    } else {
      return `${formatter.format(param.in.field, ctx)} IN (${formatter.format(param.in.values, ctx)})`;
    }
  }
}
