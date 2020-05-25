import { RootInjector } from '../injectors/root-injector';

describe('dependency-injection', () => {
  describe('class-provider', () => {
    it('should return instance of defined class', async () => {
      class Base {
        getValue(): number {
          return 0;
        }
      }

      class Test extends Base {
        getValue(): number {
          return 2;
        }
      }

      const injector = new RootInjector([
        { provide: Base, useClass: Test },
      ]);
      const instance = await injector.resolve<Base>(Base);
      expect(instance.getValue()).toBe(2);
    });

    it('should work with constructor args', async () => {
      class Base {
        getValue(): number {
          return 0;
        }
      }

      class Dep {

      }

      class Test extends Base {
        constructor(private dep: Dep) {
          super();
        }

        getValue(): number {
          return 2;
        }
      }

      const injector = new RootInjector([
        { provide: Base, useClass: Test },
        Dep,
      ]);
      const instance = await injector.resolve<Base>(Base);
      expect(instance.getValue()).toBe(2);
    });
  });
});
