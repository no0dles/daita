export type Constructable<T = any> = { new (...args: any[]): T };
export type DefaultConstructable<T = any> = { new (): T };
