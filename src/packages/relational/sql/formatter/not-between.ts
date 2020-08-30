import { FormatHandle, Formatter, FormatType } from './formatter';
import { FormatContext } from './format-context';
import { isNotBetweenDescription, NotBetweenDescription } from '../description';

export class NotBetweenFormatter
  implements FormatHandle<NotBetweenDescription<any>> {
  type = FormatType.Condition;

  canHandle(param: any): boolean {
    return isNotBetweenDescription(param);
  }

  handle(
    param: NotBetweenDescription<any>,
    ctx: FormatContext,
    formatter: Formatter,
  ): string {
    return `${formatter.format(
      param.notBetween.value,
      ctx,
    )} NOT BETWEEN ${formatter.format(
      param.notBetween.min,
      ctx,
    )} AND ${formatter.format(param.notBetween.max, ctx)}`;
  }
}
