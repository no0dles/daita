import { FormatHandle, Formatter, FormatType } from '../../../../formatter/formatter';
import { FormatContext } from '../../../../formatter/format-context';
import { IsFalseDescription, isFalseDescription } from './is-false-description';

export class IsFalseFormatter implements FormatHandle<IsFalseDescription> {
  type = FormatType.Condition;

  canHandle(param: any): boolean {
    return isFalseDescription(param);
  }

  handle(param: IsFalseDescription, ctx: FormatContext, formatter: Formatter): string {
    return `${formatter.format(param.isFalse.field, ctx)} IS FALSE`;
  }
}
