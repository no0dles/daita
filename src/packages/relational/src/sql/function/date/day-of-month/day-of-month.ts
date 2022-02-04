import { DayOfMonthDescription } from './day-of-month-description';

export function dayOfMonth(value: Date): number {
  return (<DayOfMonthDescription>{ dayOfMonth: { value } }) as any;
}
