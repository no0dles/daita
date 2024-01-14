import { FormatHandle, Formatter, FormatType } from '../../../../formatter/formatter';
import { FormatContext } from '../../../../formatter/format-context';
import { IsNotNullDescription, isNotNullDescription } from './is-not-null-description';

export class IsNotNullFormatter implements FormatHandle<IsNotNullDescription<any>> {
  type = FormatType.Condition;

  canHandle(param: any): boolean {
    return isNotNullDescription(param);
  }

  handle(param: IsNotNullDescription<any>, ctx: FormatContext, formatter: Formatter): string {
    return `${formatter.format(param.isNotNull.field, ctx)} IS NOT NULL`;
  }
}
