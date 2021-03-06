import { FormatHandle, Formatter, FormatType } from '../../../../formatter/formatter';
import { FormatContext } from '../../../../formatter/format-context';
import { ConcatDescription, isConcatDescription } from './concat-description';

export class ConcatFunctionFormatter implements FormatHandle<ConcatDescription> {
  type = FormatType.Condition;

  canHandle(param: any): boolean {
    return isConcatDescription(param);
  }

  handle(param: ConcatDescription, ctx: FormatContext, formatter: Formatter): string {
    return `CONCAT(${param.concat.map((c) => formatter.format(c, ctx)).join(',')})`;
  }
}
