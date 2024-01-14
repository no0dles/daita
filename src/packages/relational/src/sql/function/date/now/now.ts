import { NowDescription } from './now-description';

export function now(): Date {
  return (<NowDescription>{ now: {} }) as any;
}
