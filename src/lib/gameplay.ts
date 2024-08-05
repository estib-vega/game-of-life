import { paddWith } from "@/utils/array";
import { raise } from "@/utils/errors";

const DEAD_COLOR = "transparent";
const NUM_OF_NEIGHBORS = 8;

const BIRTH_THRESHOLD = 3;
const DEATH_THRESHOLD_MIN = 2;
const DEATH_THRESHOLD_MAX = 3;

const colors = [DEAD_COLOR, "lightblue"] as const;

export type NeighborCache = Map<string, number[][]>;

export function getDeadColor(): string {
  return DEAD_COLOR;
}

export function getAliveColor(): string {
  return colors[1];
}

export function randomCell(): string {
  if (Math.random() < 0.05) {
    return getAliveColor();
  }
  return getDeadColor();
}

function coord2Key(x: number, y: number): string {
  return `${x},${y}`;
}

/**
 * Retrieves the neighboring cell colors of a given cell at coordinates (x, y) in a 2D grid.
 *
 * @param x - The x-coordinate of the cell.
 * @param y - The y-coordinate of the cell.
 * @param cellColors - The 2D grid of cell colors.
 * @param cache - A cache to store the neighboring cell coords.
 * @returns An array of neighboring cell colors.
 */
export function getNeighbors(
  x: number,
  y: number,
  cellColors: string[][],
  cache: NeighborCache
): string[] {
  const neighbors: string[] = [];
  const rows = cellColors.length;
  const cols = cellColors[0].length;

  const key = coord2Key(x, y);
  // Found in cache
  if (cache.has(key)) {
    const neighborCoords =
      cache.get(key) ?? raise("Neighbor coords not found in cache.");
    for (const [neighborX, neighborY] of neighborCoords) {
      neighbors.push(cellColors[neighborX][neighborY]);
    }
    return paddWith(neighbors, DEAD_COLOR, NUM_OF_NEIGHBORS);
  }

  const neighborCoords: number[][] = [];
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue; // Skip the current cell
      const neighborX = x + i;
      const neighborY = y + j;
      if (
        neighborX >= 0 &&
        neighborX < rows &&
        neighborY >= 0 &&
        neighborY < cols
      ) {
        neighborCoords.push([neighborX, neighborY]);
        neighbors.push(cellColors[neighborX][neighborY]);
      }
    }
  }

  // Cache the neighbor coords
  cache.set(key, neighborCoords);

  return paddWith(neighbors, DEAD_COLOR, NUM_OF_NEIGHBORS);
}

export function isDead(cell: string): boolean {
  return cell === DEAD_COLOR;
}

export function isAlive(cell: string): boolean {
  return !isDead(cell);
}

export function shouldBeBorn(neighbors: string[]): boolean {
  return neighbors.filter(isAlive).length === BIRTH_THRESHOLD;
}

export function shouldBeDead(neighbors: string[]): boolean {
  const aliveNeighbors = neighbors.filter(isAlive);
  return (
    aliveNeighbors.length < DEATH_THRESHOLD_MIN ||
    aliveNeighbors.length > DEATH_THRESHOLD_MAX
  );
}

export default class Gameplay {
  private static instance: Gameplay | undefined = undefined;
  private constructor() {}

  getInstace(): Gameplay {
    if (!Gameplay.instance) {
      Gameplay.instance = new Gameplay();
    }
    return Gameplay.instance;
  }

  destroy() {
    Gameplay.instance = undefined;
  }
}
