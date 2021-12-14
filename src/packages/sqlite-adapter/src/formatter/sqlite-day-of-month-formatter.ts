import {
  DayOfMonthDescription,
  FormatContext,
  FormatHandle,
  Formatter,
  FormatType,
  isDayOfMonthDescription,
} from '@daita/relational';

export class SqliteDayOfMonthFormatter implements FormatHandle<DayOfMonthDescription> {
  type = FormatType.Value;

  canHandle(param: any): boolean {
    return isDayOfMonthDescription(param);
  }

  handle(param: DayOfMonthDescription, ctx: FormatContext, formatter: Formatter): string {
    return `round(strftime('%d', ${formatter.format(param.dayOfMonth.value, ctx)}))`;
  }
}
