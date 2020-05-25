import { RootInjector } from '../injectors/root-injector';
import { Inject } from '../inject';
import { InjectionToken } from '../injection-token';

describe('dependency-injection', () => {
  describe('value-provider', () => {
    it('should resolve token', async() => {
      const token = new InjectionToken<string>('abc');
      const injector = new RootInjector([
        {provide: token, useValue: 'foo'},
      ]);

      expect(await injector.resolve(token)).toBe('foo');
    });

    it('should resolve token on inject', async() => {
      const token = new InjectionToken<string>('abc');

      class Test {
        @Inject(token)
        public val!: string
      }

      const injector = new RootInjector([
        {provide: token, useValue: 'foo'},
        Test,
      ]);

      const test = await injector.resolve(Test);
      expect(test.val).toBe('foo');
    });

    it('should resolve multiple value tokens', async() => {
      const token = new InjectionToken<string>('abc');
      const injector = new RootInjector([
        {provide: token, useValue: 'foo'},
        {provide: token, useValue: 'bar'},
      ]);

      expect(await injector.resolveAll(token)).toEqual(['foo', 'bar']);
    });

    it('should resolve latest value tokens', async() => {
      const token = new InjectionToken<string>('abc');
      const injector = new RootInjector([
        {provide: token, useValue: 'foo'},
        {provide: token, useValue: 'bar'},
      ]);

      expect(await injector.resolve(token)).toBe('bar');
    });
  });
});
