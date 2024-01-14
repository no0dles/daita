import { JsonDescription } from './json-description';

export class Json<T> implements JsonDescription {
  constructor(public json: { value: T }) {}
}

export function json<T>(value: T): Json<T> {
  return new Json<T>({ value });
}
