import { RootInjector } from '../injectors/root-injector';

describe('dependency-injection', () => {
  describe('type-provider', () => {
    it('should not keep state on non singleton instances', async () => {
      class Test {
        counter = 0;

        increment() {
          this.counter++;
        }
      }

      const injector = new RootInjector([
        Test
      ]);
      const first = await injector.resolve(Test);
      first.increment();
      expect(first.counter).toBe(1);

      const second = await injector.resolve(Test);
      second.increment();
      expect(second.counter).toBe(1);
    });
  });
});
