import { FormatHandle, Formatter, FormatType } from './formatter';
import { FormatContext } from './format-context';
import { isSubSelectDescription, SubSelectDescription } from '../description/sub-select';

export class SubSelectFormatter implements FormatHandle<SubSelectDescription<any>> {
  type = [FormatType.Value];

  handle(param: SubSelectDescription<any>, ctx: FormatContext, formatter: Formatter): string {
    return `(${formatter.format(param.subSelect, ctx)})`;
  }

  canHandle(param: any): boolean {
    return isSubSelectDescription(param);
  }
}
