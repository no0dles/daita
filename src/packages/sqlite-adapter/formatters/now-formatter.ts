import {
  isNowDescription,
  NowDescription,
} from '../../relational/sql/description';
import {
  FormatContext,
  FormatHandle,
  Formatter,
  FormatType,
} from '../../relational/sql/formatter';

export class NowFormatter implements FormatHandle<NowDescription> {
  type = FormatType.Value;

  canHandle(param: any): boolean {
    return isNowDescription(param);
  }

  handle(
    param: NowDescription,
    ctx: FormatContext,
    formatter: Formatter,
  ): string {
    return `strftime('%Y-%m-%dT%H:%M:%fZ')`;
  }
}
