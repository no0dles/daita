import {
  FormatContext,
  FormatHandle,
  Formatter,
  FormatType,
  isYearDescription,
  YearDescription,
} from '@daita/relational';

export class SqliteYearFormatter implements FormatHandle<YearDescription> {
  type = FormatType.Value;

  canHandle(param: any): boolean {
    return isYearDescription(param);
  }

  handle(param: YearDescription, ctx: FormatContext, formatter: Formatter): string {
    return `round(strftime('%Y', ${formatter.format(param.year.value, ctx)}))`;
  }
}
