import { DayOfWeekDescription } from './day-of-week-description';

export function dayOfWeek(value: Date): number {
  return (<DayOfWeekDescription>{ dayOfWeek: { value } }) as any;
}
