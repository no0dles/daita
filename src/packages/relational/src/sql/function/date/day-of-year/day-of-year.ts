import { DayOfYearDescription } from './day-of-year-description';

export function dayOfYear(value: Date): number {
  return (<DayOfYearDescription>{ dayOfYear: { value } }) as any;
}
