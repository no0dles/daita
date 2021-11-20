import { JsonDescription } from './json-description';

export type Json<T = any> = T;

export function json<T = any>(value: T): T {
  return (<JsonDescription>{ json: { value } }) as any;
}
