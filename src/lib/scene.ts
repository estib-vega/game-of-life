import { raise } from "@/utils/errors";
import {
  getNeighbors,
  isAlive,
  isDead,
  NeighborCache,
  randomColor,
  shouldBeBorn,
  shouldBeDead,
} from "./gameplay";

interface SceneParams {
  dt: number;
  frameRate: number;
  numberOfCells: number;
  cellColors?: string[][];
}

interface SceneDescription {
  t: number;
  cellColors: string[][];
}

/**
 * Scene class
 *
 * This class controls the scene of the game.
 * It keeps track of the time and the colors of the cells, and
 * updates the colors of the cells based on the time.
 */
export default class Scene {
  private t: number = 0;
  private frameTime: number = 0;
  private cellColors: string[][] | undefined = undefined;
  private cache: Map<number, NeighborCache>;
  private static instance: Scene | undefined = undefined;
  private constructor() {
    this.cache = new Map();
  }

  static getInstance(): Scene {
    if (!Scene.instance) {
      Scene.instance = new Scene();
    }
    return Scene.instance;
  }

  private init(numberOfCells: number): string[][] {
    if (!this.cellColors) {
      this.cellColors = new Array(numberOfCells)
        .fill(null)
        .map(() => new Array(numberOfCells).fill(null).map(randomColor));
    }

    if (!this.cache.has(numberOfCells)) {
      this.cache.set(numberOfCells, new Map());
    }

    return this.cellColors;
  }

  private shouldUpdate(dt: number, frameRate: number): boolean {
    const remainingFrameTime = this.frameTime - dt;
    if (remainingFrameTime <= 0) {
      const fr = frameRate;
      this.frameTime = 1000 / fr;
      return true;
    }

    this.frameTime = remainingFrameTime;
    return false;
  }

  private updateCellColors(cellColors: string[][]) {
    const cache =
      this.cache.get(cellColors.length) ?? raise("Cache not found.");

    for (let x = 0; x < cellColors.length; x++) {
      for (let y = 0; y < cellColors[x].length; y++) {
        const lastColor = cellColors[x][y];
        const neighbors = getNeighbors(x, y, cellColors, cache);

        if (isDead(lastColor)) {
          if (shouldBeBorn(neighbors)) {
            cellColors[x][y] = "lightblue";
          }
          continue;
        }

        if (isAlive(lastColor)) {
          if (shouldBeDead(neighbors)) {
            cellColors[x][y] = "transparent";
          }
          continue;
        }
      }
    }
  }

  getScene(params: SceneParams): SceneDescription {
    this.t += params.dt;
    const cellColors = this.init(params.numberOfCells);

    if (this.shouldUpdate(params.dt, params.frameRate)) {
      this.updateCellColors(cellColors);
    }

    return {
      t: this.t,
      cellColors,
    };
  }

  destroy() {
    Scene.instance = undefined;
  }
}
