import * as Gameplay from "../gameplay";

const a = Gameplay.getAliveColor();
const d = Gameplay.getDeadColor();

describe("Gameplay", () => {
  describe("getNeighbors", () => {
    test("should return the neighbors of the cell at the specified coordinates - center", () => {
      const cellColors = [
        [d, a, d],
        [d, a, d],
        [d, a, d],
      ];
      const cache = new Map();
      const neighbors = Gameplay.getNeighbors(1, 1, cellColors, cache);
      expect(neighbors).toEqual([d, a, d, d, d, d, a, d]);
    });
    test("should return the neighbors of the cell at the specified coordinates - top left", () => {
      const cellColors = [
        [d, a, d],
        [d, a, d],
        [d, a, d],
      ];
      const cache = new Map();
      const neighbors = Gameplay.getNeighbors(0, 0, cellColors, cache);
      expect(neighbors).toEqual([a, d, a, d, d, d, d, d]);
    });
    test("should return the neighbors of the cell at the specified coordinates - bottom right", () => {
      const cellColors = [
        [d, a, d],
        [d, a, d],
        [d, a, d],
      ];
      const cache = new Map();
      const neighbors = Gameplay.getNeighbors(2, 2, cellColors, cache);
      expect(neighbors).toEqual([a, d, a, d, d, d, d, d]);
    });
    test("should return the neighbors of the cell at the specified coordinates - middle left", () => {
      const cellColors = [
        [d, a, d],
        [d, a, d],
        [d, a, d],
      ];
      const cache = new Map();
      const neighbors = Gameplay.getNeighbors(1, 0, cellColors, cache);
      expect(neighbors).toEqual([d, a, a, d, a, d, d, d]);
    });
  });

  describe("shouldBeBorn", () => {
    test("should return true if the cell should be born", () => {
      expect(Gameplay.shouldBeBorn([d, a, d, d, a, d, a, d])).toBe(true);
      expect(Gameplay.shouldBeBorn([a, a, a, d, d, d, d, d])).toBe(true);
    });
    test("should return false if the cell should not be born", () => {
      expect(Gameplay.shouldBeBorn([d, a, d, d, d, d, d, d])).toBe(false);
      expect(Gameplay.shouldBeBorn([d, d, d, d, d, d, d, d])).toBe(false);
      expect(Gameplay.shouldBeBorn([d, d, d, d, a, d, a, d])).toBe(false);
    });
  });

  describe("shouldBeDead", () => {
    test("should return true if the cell should die - overpopulation", () => {
      expect(Gameplay.shouldBeDead([d, a, d, d, a, a, a, d])).toBe(true);
    });
    test("should return true if the cell should die - loneliness", () => {
      expect(Gameplay.shouldBeDead([d, d, d, d, d, d, d, d])).toBe(true);
    });
    test("should return false if the cell should not die", () => {
      expect(Gameplay.shouldBeDead([d, a, d, d, a, d, a, d])).toBe(false);
      expect(Gameplay.shouldBeDead([d, d, a, d, d, d, a, d])).toBe(false);
    });
  });
});
