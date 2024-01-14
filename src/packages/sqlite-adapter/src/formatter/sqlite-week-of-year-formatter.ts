import {
  WeekOfYearDescription,
  FormatContext,
  FormatHandle,
  Formatter,
  FormatType,
  isWeekOfYearDescription,
} from '@daita/relational';

export class SqliteWeekOfYearFormatter implements FormatHandle<WeekOfYearDescription> {
  type = FormatType.Value;

  canHandle(param: any): boolean {
    return isWeekOfYearDescription(param);
  }

  handle(param: WeekOfYearDescription, ctx: FormatContext, formatter: Formatter): string {
    return `round(strftime('%W', ${formatter.format(param.weekOfYear.value, ctx)}))`;
  }
}
