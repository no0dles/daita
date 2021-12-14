import {
  FormatContext,
  FormatHandle,
  Formatter,
  FormatType,
  isMinuteDescription,
  isSecondDescription,
  MinuteDescription,
  SecondDescription,
} from '@daita/relational';

export class SqliteMinuteFormatter implements FormatHandle<MinuteDescription> {
  type = FormatType.Value;

  canHandle(param: any): boolean {
    return isMinuteDescription(param);
  }

  handle(param: MinuteDescription, ctx: FormatContext, formatter: Formatter): string {
    return `round(strftime('%M', ${formatter.format(param.minute.value, ctx)}))`;
  }
}
