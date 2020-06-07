import { ConcatDescription } from '../description/concat';

export function concat(...values: string[]): string {
  return <ConcatDescription>{ concat: values } as any;
}
