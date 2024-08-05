const colors = ["lightblue", "transparent"];

const FRAME_RATE = 1;

function randomColor(): string {
  return colors[Math.floor(Math.random() * colors.length)];
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
  private frameTime: number = 1000 / FRAME_RATE;
  private cellColors: string[][] | undefined = undefined;
  private static instance: Scene | undefined = undefined;
  private constructor() {}

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
    return this.cellColors;
  }

  private shouldUpdate(dt: number): boolean {
    const remainingFrameTime = this.frameTime - dt;
    if (remainingFrameTime <= 0) {
      this.frameTime = 1000 / FRAME_RATE;
      return true;
    }

    this.frameTime = remainingFrameTime;
    return false;
  }

  private updateCellColors(cellColors: string[][]) {
    for (let x = 0; x < cellColors.length; x++) {
      for (let y = 0; y < cellColors[x].length; y++) {
        const lastColor = cellColors[x][y];
        if (lastColor === "transparent") {
          cellColors[x][y] = "lightblue";
        } else {
          cellColors[x][y] = "transparent";
        }
      }
    }
  }

  getScene(dt: number, numberOfCells: number): SceneDescription {
    this.t += dt;
    const cellColors = this.init(numberOfCells);

    if (this.shouldUpdate(dt)) {
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
