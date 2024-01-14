import {
  FormatContext,
  FormatHandle,
  Formatter,
  FormatType,
  isSecondDescription,
  SecondDescription,
} from '@daita/relational';

export class SqliteSecondFormatter implements FormatHandle<SecondDescription> {
  type = FormatType.Value;

  canHandle(param: any): boolean {
    return isSecondDescription(param);
  }

  handle(param: SecondDescription, ctx: FormatContext, formatter: Formatter): string {
    return `round(strftime('%S', ${formatter.format(param.second.value, ctx)}))`;
  }
}
