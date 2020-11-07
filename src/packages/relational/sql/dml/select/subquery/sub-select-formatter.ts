import { FormatHandle, Formatter, FormatType } from '../../../../formatter/formatter';
import { FormatContext } from '../../../../formatter/format-context';
import { isSubSelectDescription, SubSelectDescription } from './sub-select-description';

export class SubSelectFormatter implements FormatHandle<SubSelectDescription<any>> {
  type = [FormatType.Value];

  handle(param: SubSelectDescription<any>, ctx: FormatContext, formatter: Formatter): string {
    return `(${formatter.format(param.subSelect, ctx)})`;
  }

  canHandle(param: any): boolean {
    return isSubSelectDescription(param);
  }
}
