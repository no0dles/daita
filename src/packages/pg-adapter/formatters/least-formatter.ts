import {
  isLeastDescription,
  LeastDescription,
} from '../../relational/sql/function/conditional/least/least-description';
import { FormatHandle, Formatter, FormatType } from '../../relational/formatter/formatter';
import { FormatContext } from '../../relational/formatter/format-context';

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
