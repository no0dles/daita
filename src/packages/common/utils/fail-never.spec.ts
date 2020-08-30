import { failNever } from "./fail-never";

describe("utils/fail-never", () => {
  it("should throw error", () => {
    const value = "foo";
    expect(() => failNever(value as never, "test")).toThrow(new Error("test"));
  });
});
