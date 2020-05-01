import { deepClone } from "./deep-clone";

describe("utils/deep-clone", () => {
  it("should clone string", () => {
    const source = 'foo';
    const cloned = deepClone(source);
    expect(source).toEqual(cloned);
  });

  it("should clone number", () => {
    const source = 12;
    const cloned = deepClone(source);
    expect(source).toEqual(cloned);
  });

  it("should clone bool", () => {
    const source = true;
    const cloned = deepClone(source);
    expect(source).toEqual(cloned);
  });

  it("should clone date", () => {
    const source = new Date();
    const cloned = deepClone(source);
    expect(source).toEqual(cloned);
  });

  it("should clone null", () => {
    const source = null;
    const cloned = deepClone(source);
    expect(source).toEqual(cloned);
  });

  it("should clone undefined", () => {
    const source = undefined;
    const cloned = deepClone(source);
    expect(source).toEqual(cloned);
  });

  it("should clone object", () => {
    const source = { foo: 'bar' };
    const cloned = deepClone(source);
    expect(source).toEqual(cloned);
  });

  it("should clone array", () => {
    const source = [1,2,'foo'];
    const cloned = deepClone(source);
    expect(source).toEqual(cloned);
  });

  it("should clone class type", () => {
    class Foo {
      constructor(public name: string) {
      }
    }
    const source = new Foo('test');
    const cloned = deepClone(source);
    expect(source).toEqual(cloned);
    expect(typeof source).toEqual(typeof cloned);
    expect(source.name).toEqual(cloned.name);
  });

  it("should clone complex object", () => {
    const source: any = { foo: true, test: { bar: "test" }, ids: [12] };
    const cloned = deepClone(source);
    expect(source).toEqual(cloned);
    cloned.foo = false;
    cloned.ids[0] = 14;
    cloned.ids.push(-1);
    expect(source.foo).toBeTruthy();
    expect(source.ids[0]).toBe(12);
    expect(source.ids).toHaveLength(1);
  });

  it("should clone complex array", () => {
    const source: any[] = [{ foo: true }, { bar: "test" }, 12];
    const cloned = deepClone(source);
    expect(source).toEqual(cloned);
    cloned[0].foo = false;
    cloned[2] = 14;
    cloned.push(-1);
    expect(source[0].foo).toBeTruthy();
    expect(source[2]).toBe(12);
    expect(source).toHaveLength(3);
  });
});
