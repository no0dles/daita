import { isNowDescription, NowDescription } from '@daita/relational';
import { FormatContext } from '@daita/relational';
import { FormatHandle, Formatter, FormatType } from '@daita/relational';

export class NowFormatter implements FormatHandle<NowDescription> {
  type = FormatType.Value;

  canHandle(param: any): boolean {
    return isNowDescription(param);
  }

  handle(param: NowDescription, ctx: FormatContext, formatter: Formatter): string {
    return `strftime('%Y-%m-%dT%H:%M:%f')`;
  }
}
