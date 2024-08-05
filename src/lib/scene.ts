const colors = ["lightblue", "transparent"];

const FRAME_RATE = 1;

const BIRTH_THRESHOLD = 3;
const DEATH_THRESHOLD_MIN = 2;
const DEATH_THRESHOLD_MAX = 3;

function randomColor(): string {
  return colors[Math.floor(Math.random() * colors.length)];
}

function isDead(cell: string): boolean {
  return cell === "transparent";
}

function isAlive(cell: string): boolean {
  return !isDead(cell);
}

/**
 * Retrieves the neighboring cell colors of a given cell at coordinates (x, y) in a 2D grid.
 *
 * @param x - The x-coordinate of the cell.
 * @param y - The y-coordinate of the cell.
 * @param cellColors - The 2D grid of cell colors.
 * @returns An array of neighboring cell colors.
 */
function getNeighbors(x: number, y: number, cellColors: string[][]): string[] {
  const neighbors: string[] = [];
  const rows = cellColors.length;
  const cols = cellColors[0].length;

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
        neighbors.push(cellColors[neighborX][neighborY]);
      }
    }
  }

  return neighbors;
}

function shouldBeBorn(neighbors: string[]): boolean {
  return neighbors.filter(isAlive).length === BIRTH_THRESHOLD;
}

function shouldBeDead(neighbors: string[]): boolean {
  const aliveNeighbors = neighbors.filter(isAlive);
  return (
    aliveNeighbors.length < DEATH_THRESHOLD_MIN ||
    aliveNeighbors.length > DEATH_THRESHOLD_MAX
  );
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

        if (isDead(lastColor)) {
          const neighbors = getNeighbors(x, y, cellColors);
          if (shouldBeBorn(neighbors)) {
            cellColors[x][y] = "lightblue";
          }
          continue;
        }

        if (isAlive(lastColor)) {
          const neighbors = getNeighbors(x, y, cellColors);
          if (shouldBeDead(neighbors)) {
            cellColors[x][y] = "transparent";
          }
          continue;
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
