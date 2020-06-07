import { FormatHandle, Formatter, FormatType } from './formatter';
import { isOrDescription, OrDescription } from '../description/or';
import { FormatContext } from './format-context';

export class OrFormatter implements FormatHandle<OrDescription> {
  type = FormatType.Condition;

  canHandle(param: any): boolean {
    return isOrDescription(param);
  }

  handle(param: OrDescription, ctx: FormatContext, formatter: Formatter): string {
    return `(${param.or.map(condition => formatter.format(condition, ctx)).join(' OR ')})`;
  }

}
