import { RootInjector } from '../injectors/root-injector';
import { InjectionToken } from '../injection-token';

describe('scoped', () => {
  it('should return scoped provider', async() => {
    const injector = new RootInjector([]);
    const token = new InjectionToken<string>('a');
    const scoped = injector.createScope([
      {provide: token, useValue: 'foo'}
    ]);
    const instance = await scoped.resolve(token);
    expect(instance).toEqual('foo');
  });
});
