import { FormatHandle, Formatter, FormatType } from './formatter';
import { AndDescription, isAndDescription } from '../description/and';
import { FormatContext } from './format-context';

export class AndFormatter implements FormatHandle<AndDescription> {
  type = FormatType.Condition;

  canHandle(param: any): boolean {
    return isAndDescription(param);
  }

  handle(param: AndDescription, ctx: FormatContext, formatter: Formatter): string {
    return `(${param.and.map(condition => formatter.format(condition, ctx)).join(' AND ')})`;
  }
}
