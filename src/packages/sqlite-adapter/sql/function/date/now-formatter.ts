import { isNowDescription, NowDescription } from '../../../../relational/sql/function/date/now/now-description';
import { FormatContext } from '../../../../relational/formatter/format-context';
import { FormatHandle, Formatter, FormatType } from '../../../../relational/formatter/formatter';

export class NowFormatter implements FormatHandle<NowDescription> {
  type = FormatType.Value;

  canHandle(param: any): boolean {
    return isNowDescription(param);
  }

  handle(param: NowDescription, ctx: FormatContext, formatter: Formatter): string {
    return `strftime('%Y-%m-%dT%H:%M:%fZ')`;
  }
}
