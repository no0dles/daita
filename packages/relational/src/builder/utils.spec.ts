import { deepClone } from '@daita/common';

describe('builder/utils', () => {
  describe('deepClone', () => {
    it('should clone and keep prototype', () => {
      class Foo {
        constructor(protected name: string) {}

        hello() {
          return this.name;
        }
      }

      class SuperFoo extends Foo {
        constructor(name: string) {
          super(name);
        }

        hello() {
          return this.name + '.super';
        }
      }

      const foo = new Foo('test');
      const clone = deepClone(foo);
      expect(clone.hello()).toEqual('test');

      const fooSuper = new SuperFoo('test');
      const cloneSuper = deepClone(fooSuper);
      expect(cloneSuper.hello()).toEqual('test.super');
    });
  });
});
