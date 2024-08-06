import { getAliveColor, getDeadColor } from "@/lib/gameplay";
import { updateCellColors } from "../updateCellColors";

const a = getAliveColor();
const d = getDeadColor();

describe("UpdateCellColors Worker", () => {
  test("should update the colors of the cells in the task correctly", () => {
    const task = {
      cellColors: [
        [d, a, d],
        [d, a, d],
        [d, a, d],
      ],
      start: 0,
      end: 3,
    };
    const result = updateCellColors(task);

    expect(result.cellColors).toEqual([
      [d, d, d],
      [a, a, a],
      [d, d, d],
    ]);

    expect(result.start).toBe(0);
    expect(result.end).toBe(3);
  });

  test("should update the colors of the cells in the task within the specified range", () => {
    const task = {
      cellColors: [
        [d, a, d],
        [d, a, d],
        [d, a, d],
      ],
      start: 1,
      end: 2,
    };
    const result = updateCellColors(task);

    expect(result.cellColors).toEqual([
      [d, a, d],
      [a, a, a],
      [d, a, d],
    ]);

    expect(result.start).toBe(1);
    expect(result.end).toBe(2);
  });

  test("should not update the colors of the cells in the task if the range is empty", () => {
    const task = {
      cellColors: [
        [d, a, d],
        [d, a, d],
        [d, a, d],
      ],
      start: 1,
      end: 1,
    };
    const result = updateCellColors(task);

    expect(result.cellColors).toEqual([
      [d, a, d],
      [d, a, d],
      [d, a, d],
    ]);

    expect(result.start).toBe(1);
    expect(result.end).toBe(1);
  });
});
