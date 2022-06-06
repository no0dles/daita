import {
  DayOfMonthDescription,
  DayOfWeekDescription,
  DayOfYearDescription,
  HourDescription,
  WeekOfYearDescription,
  isDayOfMonthDescription,
  isDayOfWeekDescription,
  isDayOfYearDescription,
  isHourDescription,
  isMinuteDescription,
  isMonthDescription,
  isSecondDescription,
  isYearDescription,
  isWeekOfYearDescription,
  MinuteDescription,
  MonthDescription,
  SecondDescription,
  YearDescription,
} from '@daita/relational';
import { FormatContext } from '@daita/relational';
import { FormatHandle, Formatter, FormatType } from '@daita/relational';

export class MonthDatePartFormatter implements FormatHandle<MonthDescription> {
  type = FormatType.Value;

  canHandle(param: any): boolean {
    return isMonthDescription(param);
  }

  handle(param: MonthDescription, ctx: FormatContext, formatter: Formatter): string {
    return `date_part('month', ${formatter.format(param.month.value, ctx)})`;
  }
}

export class YearDatePartFormatter implements FormatHandle<YearDescription> {
  type = FormatType.Value;

  canHandle(param: any): boolean {
    return isYearDescription(param);
  }

  handle(param: YearDescription, ctx: FormatContext, formatter: Formatter): string {
    return `date_part('year', ${formatter.format(param.year.value, ctx)})`;
  }
}

export class DayOfYearDatePartFormatter implements FormatHandle<DayOfYearDescription> {
  type = FormatType.Value;

  canHandle(param: any): boolean {
    return isDayOfYearDescription(param);
  }

  handle(param: DayOfYearDescription, ctx: FormatContext, formatter: Formatter): string {
    return `date_part('doy', ${formatter.format(param.dayOfYear.value, ctx)})`;
  }
}

export class DayOfMonthDatePartFormatter implements FormatHandle<DayOfMonthDescription> {
  type = FormatType.Value;

  canHandle(param: any): boolean {
    return isDayOfMonthDescription(param);
  }

  handle(param: DayOfMonthDescription, ctx: FormatContext, formatter: Formatter): string {
    return `date_part('day', ${formatter.format(param.dayOfMonth.value, ctx)})`;
  }
}

export class DayOfWeekDatePartFormatter implements FormatHandle<DayOfWeekDescription> {
  type = FormatType.Value;

  canHandle(param: any): boolean {
    return isDayOfWeekDescription(param);
  }

  handle(param: DayOfWeekDescription, ctx: FormatContext, formatter: Formatter): string {
    return `date_part('dow', ${formatter.format(param.dayOfWeek.value, ctx)})`;
  }
}

export class HourDatePartFormatter implements FormatHandle<HourDescription> {
  type = FormatType.Value;

  canHandle(param: any): boolean {
    return isHourDescription(param);
  }

  handle(param: HourDescription, ctx: FormatContext, formatter: Formatter): string {
    return `date_part('hour', ${formatter.format(param.hour.value, ctx)})`;
  }
}

export class MinuteDatePartFormatter implements FormatHandle<MinuteDescription> {
  type = FormatType.Value;

  canHandle(param: any): boolean {
    return isMinuteDescription(param);
  }

  handle(param: MinuteDescription, ctx: FormatContext, formatter: Formatter): string {
    return `date_part('minute', ${formatter.format(param.minute.value, ctx)})`;
  }
}

export class SecondDatePartFormatter implements FormatHandle<SecondDescription> {
  type = FormatType.Value;

  canHandle(param: any): boolean {
    return isSecondDescription(param);
  }

  handle(param: SecondDescription, ctx: FormatContext, formatter: Formatter): string {
    return `date_part('second', ${formatter.format(param.second.value, ctx)})`;
  }
}

export class WeekOfYearPartFormatter implements FormatHandle<WeekOfYearDescription> {
  type = FormatType.Value;

  canHandle(param: any): boolean {
    return isWeekOfYearDescription(param);
  }

  handle(param: SecondDescription, ctx: FormatContext, formatter: Formatter): string {
    return `date_part('week', ${formatter.format(param.second.value, ctx)})`;
  }
}
