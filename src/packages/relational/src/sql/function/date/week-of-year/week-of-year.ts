import { WeekOfYearDescription } from './week-of-year-description';

export function weekOfYear(value: Date): number {
  return (<WeekOfYearDescription>{ weekOfYear: { value } }) as any;
}
