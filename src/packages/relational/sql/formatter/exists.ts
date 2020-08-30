import { FormatHandle, Formatter, FormatType } from './formatter';
import { FormatContext } from './format-context';
import { ExistsDescription, isExistsDescription } from '../description';

export class ExistsFormatter implements FormatHandle<ExistsDescription> {
  type = FormatType.Condition;

  canHandle(param: any): boolean {
    return isExistsDescription(param);
  }

  handle(
    param: ExistsDescription,
    ctx: FormatContext,
    formatter: Formatter,
  ): string {
    return `EXISTS (${formatter.format(param.exists, ctx)})`;
  }
}
