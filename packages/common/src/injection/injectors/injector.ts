import { ClassProvider, isClassProvider } from '../providers/class-provider';
import { isValueProvider, ValueProvider } from '../providers/value-provider';
import { FactoryProvider, isFactoryProvider } from '../providers/factory-provider';
import { getInjectScope, InjectScope } from '../singleton';
import { ResolveFunction } from '../resolve-function';
import { Provider } from '../providers/provider';
import { Constructable } from '../../types';
import { generateRandomId } from '../random-id';
import { getInjects } from '../inject';
import { failNever } from '../../utils';
import { InjectionToken } from '../injection-token';

export abstract class Injector {
  protected resolveFunctions: ResolveFunction[] = [];

  protected constructor(providers: Provider[]) {
    for (const provider of providers) {
      this.provide(provider);
    }
  }

  provide(provider: Provider) {
    if (typeof provider === 'function') {
      this.addResolver(provider, () => new provider(), []);
    } else {
      if (isValueProvider(provider)) {
        this.addResolver(provider.provide, () => provider.useValue, []);
      } else if (isFactoryProvider(provider)) {
        this.addResolver(provider.provide, provider.useFactory, provider.deps || []);
      } else if (isClassProvider(provider)) {
        this.addResolver(provider.provide, () => new provider.useClass(), []);
      } else {
        failNever(provider, 'unknown provider type');
      }
    }
  }

  protected abstract getScope(): InjectScope;

  protected addResolver(type: any, factory: (...args: any[]) => any, deps: any[]): ResolveFunction {
    const fn = <ResolveFunction>{
      factory,
      deps,
      scope: getInjectScope(type),
      instance: undefined,
      type,
      id: generateRandomId(),
    };
    this.resolveFunctions.push(fn);
    return fn;
  }

  protected getResolvers(type: any): ResolveFunction[] {
    const fns = this.resolveFunctions.filter(fn => fn.type === type);
    if (fns.length === 0 && typeof type === 'function') {
      fns.push(this.addResolver(type, () => new type(), []));
    }
    return fns;
  }

  protected async internalArrayResolve<T>(type: any, resolved: any): Promise<T[]> {
    const resolveFunction = this.getResolvers(type);
    const result = [];
    for (const fn of resolveFunction) {
      result.push(await this.createInstance(type, fn, resolved));
    }
    return result;
  }

  protected async internalResolve<T>(type: any, resolved: any): Promise<T | null> {
    const resolveFunction = this.getResolvers(type);

    if (resolveFunction.length > 0) {
      return this.createInstance(type, resolveFunction[resolveFunction.length - 1], resolved);
    } else {
      return null;
    }
  }

  protected async createInstance(type: any, resolveFn: ResolveFunction, resolved: any): Promise<any> {
    if (resolved[resolveFn.id]) {
      return resolved[resolveFn.id];
    }

    if (resolveFn.instance !== undefined) {
      return resolveFn.instance;
    }

    const instanceDeps = await Promise.all(resolveFn.deps.map(dep => this.internalResolve(dep, resolved)));
    let instance = resolveFn.factory.apply(null, instanceDeps);
    if (instance instanceof Promise) {
      instance = await instance;
    }

    resolved[resolveFn.id] = instance;

    if (getInjectScope(type) <= this.getScope()) {
      resolveFn.instance = instance;
    }

    for (const inject of getInjects(type)) {

      const injectInstance = await (inject.options.array ? this.internalArrayResolve(inject.type, resolved) : this.internalResolve<any>(inject.type, resolved));
      if (injectInstance === null) {
        throw new Error(`could not resolve type ${inject.type}`);
      }
      instance[inject.propertyKey] = injectInstance;
    }

    return instance;
  }

  resolve<T>(type: Constructable<T>): Promise<T>
  resolve<T>(type: InjectionToken<T>): Promise<T>
  async resolve<T>(type: any): Promise<T> {
    const instance = await this.internalResolve<T>(type, {});
    if (instance === null) {
      throw new Error(`could not resolve type ${type}`);
    }
    return instance;
  }

  resolveOptional<T>(type: Constructable<T>): Promise<T | null>
  resolveOptional<T>(type: InjectionToken<T>): Promise<T | null>
  resolveOptional<T>(type: any): Promise<T | null>
  resolveOptional<T>(type: any): Promise<T | null> {
    return this.internalResolve<T>(type, {});
  }

  resolveAll<T>(type: Constructable<T>): Promise<T[]>
  resolveAll<T>(type: InjectionToken<T>): Promise<T[]>
  resolveAll<T>(type: any): Promise<T[]>
  resolveAll<T>(type: any): Promise<T[]> {
    return this.internalArrayResolve<T>(type, {});
  }
}
