export interface ResolvableFunction<T> {
  (): Promise<T>;
}

const isResolvableFunction = (val: ResolvableFunction<any> | any): val is ResolvableFunction<any> =>
  typeof val === 'function';

export class Resolvable<T> {
  private value: T | null = null;

  constructor(
    private resolveFn: ResolvableFunction<T> | T,
    private closeFn: (value: T | null) => Promise<void> | void = () => {},
  ) {}

  instant(): T | null {
    return this.value;
  }

  async get(): Promise<T> {
    if (!this.value) {
      if (isResolvableFunction(this.resolveFn)) {
        this.value = await this.resolveFn();
      } else {
        this.value = this.resolveFn;
      }
    }
    return this.value;
  }

  reset() {
    this.value = null;
  }

  async close(): Promise<void> {
    await this.closeFn(this.value);
    this.reset();
  }
}
