import { arrayClone } from "./array-clone";

describe("utils/array-clone", () => {
  it("should clone and create own reference", () => {
    const source = ["a", "b", "c"];
    const cloned = arrayClone(source);
    cloned.splice(0, 1);
    expect(cloned).toHaveLength(2);
    expect(source).toHaveLength(3);
  });
});
