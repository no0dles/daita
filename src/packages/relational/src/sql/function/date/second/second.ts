import { SecondDescription } from './second-description';

export function second(value: Date): number {
  return (<SecondDescription>{ second: { value } }) as any;
}
