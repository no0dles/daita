import { FormatHandle, Formatter, FormatType } from './formatter';
import { FormatContext } from './format-context';
import { InDescription, isInDescription } from '../description/in';

export class InFormatter implements FormatHandle<InDescription<any>> {
  type = FormatType.Condition;

  canHandle(param: any): boolean {
    return isInDescription(param);
  }

  handle(param: InDescription<any>, ctx: FormatContext, formatter: Formatter): string {
    return `${formatter.format(param.in.field, ctx)} IN (${param.in.values
      .map((value) => formatter.format(value, ctx))
      .join(', ')})`;
  }
}
