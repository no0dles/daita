import {
  isLeastDescription,
  LeastDescription,
} from '@daita/relational';
import { FormatHandle, Formatter, FormatType } from '@daita/relational';
import { FormatContext } from '@daita/relational';

export class LeastFormatter implements FormatHandle<LeastDescription> {
  type = FormatType.Value;

  canHandle(param: any): boolean {
    return isLeastDescription(param);
  }

  handle(param: LeastDescription, ctx: FormatContext, formatter: Formatter): string {
    return `least(${formatter.format(param.least.left, ctx)}, ${formatter.format(
      param.least.right,
      ctx,
    )})::NUMERIC(26,10)`;
  }
}
