import { FormatHandle, Formatter, FormatType } from '../../../../formatter/formatter';
import { FormatContext } from '../../../../formatter/format-context';
import { isCeilDescription, CeilDescription } from './ceil-description';

export class CeilFormatter implements FormatHandle<CeilDescription> {
  type = FormatType.Value;

  canHandle(param: any): boolean {
    return isCeilDescription(param);
  }

  handle(param: CeilDescription, ctx: FormatContext, formatter: Formatter): string {
    return `CEIL(${formatter.format(param.ceil.value, ctx)})`;
  }
}
