import { MonthDescription } from './month-description';

export function month(value: Date): number {
  return (<MonthDescription>{ month: { value } }) as any;
}
