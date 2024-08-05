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
import { raise } from "@/utils/errors";

const cache: Map<number, NeighborCache> = new Map();

function getOrCreateCache(key: number): NeighborCache {
  if (!cache.has(key)) {
    cache.set(key, new Map());
  }
  return cache.get(key) ?? raise("Cache not found.");
}

self.onmessage = (e: MessageEvent<string[][]>) => {
  const cellColors = e.data;
  const cache = getOrCreateCache(cellColors.length);
  const updates: [number, number, string][] = [];

  for (let x = 0; x < cellColors.length; x++) {
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

  self.postMessage(cellColors);
};
