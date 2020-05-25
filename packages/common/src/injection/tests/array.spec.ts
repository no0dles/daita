import { RootInjector } from '../injectors/root-injector';
import { InjectionToken } from '../injection-token';

describe('array', () => {
  const token = new InjectionToken<string>('token');

  it('should return last instance of array', async () => {
    const injector = new RootInjector([
      { provide: token, useValue: 'a' },
      { provide: token, useValue: 'b' },
    ]);
    const instance = await injector.resolve(token);
    expect(instance).toEqual('b');
  });

  it('should return array of instances', async () => {
    const injector = new RootInjector([
      { provide: token, useValue: 'a' },
      { provide: token, useValue: 'b' },
    ]);
    const instance = await injector.resolveAll(token);
    expect(instance).toEqual(['a', 'b']);
  });
});
