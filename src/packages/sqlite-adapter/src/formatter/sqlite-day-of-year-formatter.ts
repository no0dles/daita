import {
  DayOfYearDescription,
  FormatContext,
  FormatHandle,
  Formatter,
  FormatType,
  isDayOfYearDescription,
} from '@daita/relational';

export class SqliteDayOfYearFormatter implements FormatHandle<DayOfYearDescription> {
  type = FormatType.Value;

  canHandle(param: any): boolean {
    return isDayOfYearDescription(param);
  }

  handle(param: DayOfYearDescription, ctx: FormatContext, formatter: Formatter): string {
    return `round(strftime('%j', ${formatter.format(param.dayOfYear.value, ctx)}))`;
  }
}
