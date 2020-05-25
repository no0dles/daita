import {Inject} from '../inject';
import { RootInjector } from '../injectors/root-injector';

describe('dependency-injection', () => {
  describe('dynamic type provider', () => {
    it('should resolve non provided provider', async() => {
      class Test {
        counter: number;

        constructor() {
          this.counter = 2;
        }
      }

      const injector = new RootInjector([]);
      const instance = await injector.resolve(Test);
      expect(instance.counter).toBe(2);
    });

    it('should resolve nested provider', async() => {
      class NestedTest {
        value = 'bar';
      }

      class Test {
        @Inject(NestedTest)
        nested!: NestedTest;
      }


      const injector = new RootInjector([]);
      const instance = await injector.resolve(Test);
      expect(instance.nested.value).toBe('bar');
    });

    it('should resolve cycling provider instance', async() => {
      class Test {
        @Inject(Test)
        nested!: Test;

        value = 0;
      }


      const injector = new RootInjector([]);
      const instance = await injector.resolve(Test);
      expect(instance.nested).not.toBeUndefined();
      expect(instance.value).toBe(0)
      instance.nested.value = 2;
      expect(instance.value).toBe(2);
    });
  });
});
