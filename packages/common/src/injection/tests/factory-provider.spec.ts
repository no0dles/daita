import { RootInjector } from '../injectors/root-injector';
import { InjectionToken } from '../injection-token';

describe('dependency-injection', () => {
  describe('factory-provider', () => {
    it('should resolve provider with factory', async() => {
      class Test {
        value!: number;
      }

      const injector = new RootInjector([
        {
          provide: Test,
          useFactory: () => {
            const instance = new Test();
            instance.value = 2;
            return instance;
          },
        },
      ]);
      const instance = await injector.resolve(Test);
      expect(instance.value).toBe(2);
    });

    it('should provide deps in factory', async() => {
      class Test {
        value!: number;
      }

      const token = new InjectionToken<number>('abc');
      const injector = new RootInjector([
        {provide: token, useValue: 1},
        {
          provide: Test,
          useFactory: (value) => {
            const instance = new Test();
            instance.value = value;
            return instance;
          },
          deps: [token]
        },
      ]);
      const instance = await injector.resolve(Test);
      expect(instance.value).toBe(1);
    });

    it('should return async value', async () => {
      const token = new InjectionToken<string>('token');
      const value = 'a';
      const injector = new RootInjector([
        {
          provide: 'dep',
          useFactory: async () => {
            return 'foo';
          },
        },
        {
          provide: token,
          useFactory: async (val) => {
            expect(val).toEqual('foo');
            return value;
          },
          deps: ['dep'],
        },
      ]);
      const instance = await injector.resolve(token);
      expect(instance).toEqual(value);
    });
  });
});
