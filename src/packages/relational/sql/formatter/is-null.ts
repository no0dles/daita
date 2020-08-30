import { FormatHandle, Formatter, FormatType } from './formatter';
import { FormatContext } from './format-context';
import { isNullDescription, IsNullDescription } from '../description';

export class IsNullFormatter implements FormatHandle<IsNullDescription<any>> {
  type = FormatType.Condition;

  canHandle(param: any): boolean {
    return isNullDescription(param);
  }

  handle(
    param: IsNullDescription<any>,
    ctx: FormatContext,
    formatter: Formatter,
  ): string {
    return `${formatter.format(param.isNull.field, ctx)} IS NULL`;
  }
}
