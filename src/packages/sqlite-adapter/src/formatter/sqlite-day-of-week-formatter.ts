import {
  DayOfWeekDescription,
  FormatContext,
  FormatHandle,
  Formatter,
  FormatType,
  isDayOfMonthDescription,
  isDayOfWeekDescription,
} from '@daita/relational';

export class SqliteDayOfWeekFormatter implements FormatHandle<DayOfWeekDescription> {
  type = FormatType.Value;

  canHandle(param: any): boolean {
    return isDayOfWeekDescription(param);
  }

  handle(param: DayOfWeekDescription, ctx: FormatContext, formatter: Formatter): string {
    return `round(strftime('%w', ${formatter.format(param.dayOfWeek.value, ctx)}))`;
  }
}
