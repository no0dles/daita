import { FormatHandle, Formatter, FormatType } from '../../../../formatter/formatter';
import { FormatContext } from '../../../../formatter/format-context';
import { IsTrueDescription, isTrueDescription } from './is-true-description';

export class IsTrueFormatter implements FormatHandle<IsTrueDescription> {
  type = FormatType.Condition;

  canHandle(param: any): boolean {
    return isTrueDescription(param);
  }

  handle(param: IsTrueDescription, ctx: FormatContext, formatter: Formatter): string {
    return `${formatter.format(param.isTrue.field, ctx)} IS TRUE`;
  }
}
