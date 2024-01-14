import { FormatHandle, Formatter, FormatType } from '../../../formatter/formatter';
import { FormatContext } from '../../../formatter/format-context';
import { AllDescription, isAllDescription } from './all-description';

export class AllFormatter implements FormatHandle<AllDescription<any>> {
  type = FormatType.Table;

  canHandle(param: any): boolean {
    return isAllDescription(param);
  }

  handle(param: AllDescription<any>, ctx: FormatContext, formatter: Formatter): string {
    if (param.all.table) {
      return `${formatter.format(param.all.table, ctx)}.*`;
    } else {
      return '*';
    }
  }
}
