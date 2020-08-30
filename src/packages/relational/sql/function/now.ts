import { NowDescription } from '../description/now';

export function now(): Date {
  return (<NowDescription>{ now: {} }) as any;
}
