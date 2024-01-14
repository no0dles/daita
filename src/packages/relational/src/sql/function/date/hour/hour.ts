import { HourDescription } from './hour-description';

export function hour(value: Date): number {
  return (<HourDescription>{ hour: { value } }) as any;
}
