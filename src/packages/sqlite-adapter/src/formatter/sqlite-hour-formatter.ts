import {
  FormatContext,
  FormatHandle,
  Formatter,
  FormatType,
  isHourDescription,
  HourDescription,
  TableDescription,
} from '@daita/relational';

export class SqliteHourFormatter implements FormatHandle<HourDescription> {
  type = FormatType.Value;

  canHandle(param: any): boolean {
    return isHourDescription(param);
  }

  handle(param: HourDescription, ctx: FormatContext, formatter: Formatter): string {
    return `round(strftime('%H', ${formatter.format(param.hour.value, ctx)}))`;
  }
}
