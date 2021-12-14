import { FormatHandle, Formatter, FormatType } from '../../../../formatter/formatter';
import { FormatContext } from '../../../../formatter/format-context';
import { isCoalesceDescription, CoalesceDescription } from './coalesce-description';

export class CoalesceFormatter implements FormatHandle<CoalesceDescription> {
  type = FormatType.Value;

  canHandle(param: any): boolean {
    return isCoalesceDescription(param);
  }

  handle(param: CoalesceDescription, ctx: FormatContext, formatter: Formatter): string {
    return `COALESCE(${param.coalesce.values.map((v) => formatter.format(v, ctx)).join(', ')})`;
  }
}
