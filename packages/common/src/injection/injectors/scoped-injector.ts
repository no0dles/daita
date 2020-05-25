import {Injector} from './injector';
import { InjectScope } from '../singleton';
import { Provider } from '../providers/provider';

export class ScopedInjector extends Injector {
  constructor(providers: Provider[]) {
    super(providers);
    this.addResolver(ScopedInjector, () => this, []);
  }

  protected getScope(): InjectScope {
    return InjectScope.Scoped;
  }
}
