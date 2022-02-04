import {
  FormatContext,
  FormatHandle,
  Formatter,
  FormatType,
  isMonthDescription,
  MonthDescription,
} from '@daita/relational';

export class SqliteMonthFormatter implements FormatHandle<MonthDescription> {
  type = FormatType.Value;

  canHandle(param: any): boolean {
    return isMonthDescription(param);
  }

  handle(param: MonthDescription, ctx: FormatContext, formatter: Formatter): string {
    return `round(strftime('%m', ${formatter.format(param.month.value, ctx)}))`;
  }
}
