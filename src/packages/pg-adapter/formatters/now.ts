import { isNowDescription, NowDescription } from '../../relational/sql/description/now';
import { FormatContext } from '../../relational/sql/formatter/format-context';
import { FormatHandle, Formatter, FormatType } from '../../relational/sql/formatter/formatter';

export class NowFormatter implements FormatHandle<NowDescription> {
  type = FormatType.Value;

  canHandle(param: any): boolean {
    return isNowDescription(param);
  }

  handle(param: NowDescription, ctx: FormatContext, formatter: Formatter): string {
    return `now()`;
  }
}
