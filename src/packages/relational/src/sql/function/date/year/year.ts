import { YearDescription } from './year-description';

export function year(value: Date): number {
  return (<YearDescription>{ year: { value } }) as any;
}
