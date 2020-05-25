import { Injector } from './injector';
import { ScopedInjector } from './scoped-injector';
import { InjectScope } from '../singleton';
import { Provider } from '../providers/provider';

export class RootInjector extends Injector {
  constructor(providers: Provider[]) {
    super(providers);
    this.addResolver(RootInjector, () => this, []);
  }

  protected getScope(): InjectScope {
    return InjectScope.Singleton;
  }

  createScope(providers: Provider[]): ScopedInjector {
    const scoped = new ScopedInjector([]);
    (<any>scoped).resolveFunctions = this.resolveFunctions.map(fn => { //TODO
      if (fn.scope === InjectScope.Singleton) {
        return fn;
      } else {
        return {
          type: fn.type,
          id: fn.id,
          factory: fn.factory,
          deps: fn.deps,
          instance: undefined,
          scope: fn.scope,
        };
      }
    });

    for (const provider of providers) {
      scoped.provide(provider);
    }

    return scoped;
  }

}
