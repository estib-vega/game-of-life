import {
  getAliveColor,
  getDeadColor,
  getNeighbors,
  isAlive,
  isDead,
  NeighborCache,
  shouldBeBorn,
  shouldBeDead,
} from "@/lib/gameplay";
import { TaskDescription } from "@/lib/workerController";
import { raise } from "@/utils/errors";

const cache: Map<number, NeighborCache> = new Map();

function getOrCreateCache(key: number): NeighborCache {
  if (!cache.has(key)) {
    cache.set(key, new Map());
  }
  return cache.get(key) ?? raise("Cache not found.");
}

/**
 * Updates the colors of the cells in the specified task.
 *
 * @param task - The task description containing the cell colors, start index, and end index.
 * @returns The updated task description with the modified cell colors, start index, and end index.
 */
export function updateCellColors(task: TaskDescription): TaskDescription {
  const { cellColors, start, end } = task;

  const cache = getOrCreateCache(cellColors.length);
  const updates: [number, number, string][] = [];

  for (let x = start; x < end; x++) {
    for (let y = 0; y < cellColors[x].length; y++) {
      const lastColor = cellColors[x][y];
      const neighbors = getNeighbors(x, y, cellColors, cache);

      if (isDead(lastColor)) {
        if (shouldBeBorn(neighbors)) {
          updates.push([x, y, getAliveColor()]);
        }
        continue;
      }

      if (isAlive(lastColor)) {
        if (shouldBeDead(neighbors)) {
          updates.push([x, y, getDeadColor()]);
        }
        continue;
      }
    }
  }

  for (const [x, y, color] of updates) {
    cellColors[x][y] = color;
  }

  return { cellColors, start, end };
}

self.onmessage = (e: MessageEvent<TaskDescription>) => {
  const { cellColors, start, end } = updateCellColors(e.data);
  self.postMessage({ cellColors, start, end });
};
