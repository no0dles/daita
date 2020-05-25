import { Singleton } from '../singleton';
import { RootInjector } from '../injectors/root-injector';

describe('dependency-injection', () => {
  describe('singleton', () => {
    it('should resolve keep state on singleton', async () => {
      @Singleton
      class TestA {
        counter = 0;
      }

      const injector = new RootInjector([]);
      const firstInstance = await injector.resolve(TestA);
      expect(firstInstance.counter).toBe(0);

      firstInstance.counter = 1;

      const secondInstance = await injector.resolve(TestA);
      expect(secondInstance.counter).toBe(1);
    });
  });
});
