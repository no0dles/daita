export const Singleton: ClassDecorator = target => {
  const obj: any = target;
  obj.scope = InjectScope.Singleton;
};

export const Scoped: ClassDecorator = target => {
  const obj: any = target;
  obj.scope = InjectScope.Scoped;
};

export const Transient: ClassDecorator = target => {
  const obj: any = target;
  obj.scope = InjectScope.Transient;
};

export enum InjectScope {
  Singleton = 0,
  Scoped = 1,
  Transient = 2,
}

export function getInjectScope(type: any): InjectScope {
  return (<any>type).scope;
}
