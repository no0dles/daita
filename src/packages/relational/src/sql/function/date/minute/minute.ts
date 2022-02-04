import { MinuteDescription } from './minute-description';

export function minute(value: Date): number {
  return (<MinuteDescription>{ minute: { value } }) as any;
}
