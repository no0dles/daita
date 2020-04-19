import { DefaultConstructable } from '../constructable';

export class DocumentCreateContext<T> {
  constructor(private type: DefaultConstructable<T>) {}
  async exec(): Promise<void> {}
}
