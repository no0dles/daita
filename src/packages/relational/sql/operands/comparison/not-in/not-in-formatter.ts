import { FormatHandle, Formatter, FormatType } from '../../../../formatter/formatter';
import { FormatContext } from '../../../../formatter/format-context';
import { isNotInDescription, NotInDescription } from './not-in-description';

export class NotInFormatter implements FormatHandle<NotInDescription<any>> {
  type = FormatType.Condition;

  canHandle(param: any): boolean {
    return isNotInDescription(param);
  }

  handle(param: NotInDescription<any>, ctx: FormatContext, formatter: Formatter): string {
    return `${formatter.format(param.notIn.field, ctx)} NOT IN (${param.notIn.values.map((v) =>
      formatter.format(v, ctx),
    )})`;
  }
}
