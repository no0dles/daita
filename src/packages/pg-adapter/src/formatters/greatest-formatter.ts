import {
  GreatestDescription,
  isGreatestDescription,
} from '@daita/relational/sql/function/conditional/greatest/greatest-description';
import { FormatContext } from '@daita/relational/formatter/format-context';
import { FormatHandle, Formatter, FormatType } from '@daita/relational/formatter/formatter';

export class GreatestFormatter implements FormatHandle<GreatestDescription> {
  type = FormatType.Value;

  canHandle(param: any): boolean {
    return isGreatestDescription(param);
  }

  handle(param: GreatestDescription, ctx: FormatContext, formatter: Formatter): string {
    return `greatest(${formatter.format(param.greatest.left, ctx)}, ${formatter.format(
      param.greatest.right,
      ctx,
    )})::NUMERIC(26,10)`;
  }
}
