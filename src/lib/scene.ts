import { raise } from "@/utils/errors";
import {
  getAliveColor,
  getDeadColor,
  getNeighbors,
  isAlive,
  isDead,
  NeighborCache,
  randomCell,
  shouldBeBorn,
  shouldBeDead,
} from "./gameplay";

enum SceneState {
  Playing = "playing",
  Paused = "paused",
}

interface SceneParams {
  dt: number;
  frameRate: number;
  numberOfCells: number;
  canvasSize: number;
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
  private state: SceneState;
  private t: number = 0;
  private frameTime: number = 0;
  canvasSize: number | undefined = undefined;
  private cellColors: string[][] | undefined = undefined;
  private cache: Map<number, NeighborCache>;
  private static instance: Scene | undefined = undefined;

  private constructor() {
    this.state = SceneState.Paused;
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
        .map(() => new Array(numberOfCells).fill(null).map(randomCell));
    }

    if (!this.cache.has(numberOfCells)) {
      this.cache.set(numberOfCells, new Map());
    }

    return this.cellColors;
  }

  private shouldUpdate(dt: number, frameRate: number): boolean {
    if (this.state === SceneState.Paused) {
      return false;
    }

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
  }

  getScene(params: SceneParams): SceneDescription {
    this.t += params.dt;
    this.canvasSize = params.canvasSize;
    const cellColors = this.init(params.numberOfCells);

    if (this.shouldUpdate(params.dt, params.frameRate)) {
      this.updateCellColors(cellColors);
    }

    return {
      t: this.t,
      cellColors,
    };
  }

  restart() {
    this.t = 0;
    this.cellColors = undefined;
  }

  play() {
    this.state = SceneState.Playing;
  }

  pause() {
    this.state = SceneState.Paused;
  }

  toggleCell(point: { x: number; y: number }) {
    if (this.state !== SceneState.Paused) {
      return;
    }
    if (!this.canvasSize || !this.cellColors?.length) {
      return;
    }

    const cellSize = this.canvasSize / this.cellColors.length;
    const x = Math.floor(point.x / cellSize);
    const y = Math.floor(point.y / cellSize);
    this.cellColors[x][y] = isAlive(this.cellColors[x][y])
      ? getDeadColor()
      : getAliveColor();
  }

  clear() {
    if (!this.canvasSize || !this.cellColors?.length) {
      return;
    }

    this.cellColors = new Array(this.cellColors.length)
      .fill(null)
      .map(() => new Array(this.cellColors!.length).fill(getDeadColor()));
  }

  destroy() {
    Scene.instance = undefined;
  }
}
