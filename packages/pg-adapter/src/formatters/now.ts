import {
  FormatContext,
  FormatHandle,
  Formatter,
  FormatType,
  isNowDescription,
  NowDescription,
} from '@daita/relational';

export class NowFormatter implements FormatHandle<NowDescription> {
  type = FormatType.Value;

  canHandle(param: any): boolean {
    return isNowDescription(param);
  }

  handle(param: NowDescription, ctx: FormatContext, formatter: Formatter): string {
    return `now()`;
  }
}
