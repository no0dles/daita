import { ConcatDescription } from './concat-description';

export function concat(...values: string[]): string {
  return (<ConcatDescription>{ concat: values }) as any;
}
