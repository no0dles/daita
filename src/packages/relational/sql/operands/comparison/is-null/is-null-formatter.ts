import { FormatHandle, Formatter, FormatType } from '../../../../formatter/formatter';
import { FormatContext } from '../../../../formatter/format-context';
import { IsNullDescription, isNullDescription } from './is-null-description';

export class IsNullFormatter implements FormatHandle<IsNullDescription<any>> {
  type = FormatType.Condition;

  canHandle(param: any): boolean {
    return isNullDescription(param);
  }

  handle(param: IsNullDescription<any>, ctx: FormatContext, formatter: Formatter): string {
    return `${formatter.format(param.isNull.field, ctx)} IS NULL`;
  }
}
