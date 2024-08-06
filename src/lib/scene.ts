import {
  DEFAULT_NUMBER_OF_CELLS,
  getAliveColor,
  getDeadColor,
  isAlive,
  NeighborCache,
  randomCell,
} from "./gameplay";
import WorkerController from "./workerController";

enum SceneState {
  Playing = "playing",
  Paused = "paused",
}

interface SceneParams {
  dt: number;
  frameRate: number;
  canvasSize: number;
  cellColors?: string[][];
}

export interface SceneDescription {
  t: number;
  cellColors: string[][];
  numberOfCells: number;
}

function validateCellColors(something: unknown): something is string[][] {
  if (!Array.isArray(something)) {
    return false;
  }

  for (const row of something) {
    if (!Array.isArray(row)) {
      return false;
    }

    if (row.length !== something.length) {
      return false;
    }

    for (const cell of row) {
      if (typeof cell !== "string") {
        return false;
      }
    }
  }

  return true;
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
  private numberOfCells: number = DEFAULT_NUMBER_OF_CELLS;
  private canvasSize: number | undefined = undefined;
  private cellColors: string[][] | undefined = undefined;
  private cache: Map<number, NeighborCache>;
  private workerController: WorkerController;
  private static instance: Scene | undefined = undefined;

  private constructor() {
    this.state = SceneState.Paused;
    this.cache = new Map();
    this.workerController = new WorkerController();
  }

  static getInstance(): Scene {
    if (!Scene.instance) {
      Scene.instance = new Scene();
    }
    return Scene.instance;
  }

  private init(): string[][] {
    if (!this.cellColors) {
      this.cellColors = new Array(this.numberOfCells)
        .fill(null)
        .map(() => new Array(this.numberOfCells).fill(null).map(randomCell));
    }

    if (!this.cache.has(this.numberOfCells)) {
      this.cache.set(this.numberOfCells, new Map());
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

  async getScene(params: SceneParams): Promise<SceneDescription> {
    this.t += params.dt;
    this.canvasSize = params.canvasSize;
    const cellColors = this.init();

    if (!this.shouldUpdate(params.dt, params.frameRate)) {
      return {
        t: this.t,
        cellColors,
        numberOfCells: this.numberOfCells,
      };
    }

    this.cellColors = await this.workerController.calculateCells(cellColors);
    return {
      t: this.t,
      cellColors: this.cellColors,
      numberOfCells: this.numberOfCells,
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

  setNumberOfCells(numOfCells: number) {
    this.numberOfCells = numOfCells;
    this.cellColors = undefined;
  }

  toJsonString(): string {
    if (!this.cellColors) {
      return "";
    }

    return JSON.stringify(this.cellColors);
  }

  fromJsonString(data: string): SceneDescription | undefined {
    try {
      const parsedData = JSON.parse(data);
      if (!validateCellColors(parsedData)) {
        throw new Error("Invalid JSON format.");
      }
      this.numberOfCells = parsedData.length;
      this.cellColors = parsedData;
      this.t = 0;

      return {
        t: this.t,
        cellColors: this.cellColors,
        numberOfCells: this.numberOfCells,
      };
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Invalid JSON data.", e);
    }
    return undefined;
  }

  destroy() {
    Scene.instance = undefined;
  }
}
