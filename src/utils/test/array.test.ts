import * as ArrayUtils from "../array";

describe("ArrayUtils", () => {
  describe("paddWith", () => {
    test("should return the same array if n is equal to the array length", () => {
      const arr = [1, 2, 3];
      expect(ArrayUtils.paddWith(arr, 0, 3)).toEqual(arr);
    });
    test("should fill the array with the value if n is greater than the array length", () => {
      const arr = [1, 2, 3];
      expect(ArrayUtils.paddWith(arr, 0, 5)).toEqual([1, 2, 3, 0, 0]);
    });
    test("should return the same array if n is less than the array length", () => {
      const arr = [1, 2, 3];
      expect(ArrayUtils.paddWith(arr, 0, 2)).toEqual(arr);
    });
  });
});
