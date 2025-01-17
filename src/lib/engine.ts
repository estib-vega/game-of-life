import Scene from "./scene";

export const DEFAULT_FRAME_RATE = 10;

export interface DrawParams {
  ctx: CanvasRenderingContext2D;
}

export default class Engine {
  private static instance: Engine | undefined = undefined;
  private frameRate: number = DEFAULT_FRAME_RATE;
  private lastTime: number = 0;
  private scene: Scene;
  private constructor() {
    this.scene = Scene.getInstance();
  }

  static getInstance(): Engine {
    if (!Engine.instance) {
      Engine.instance = new Engine();
    }
    return Engine.instance;
  }

  private cell(
    x: number,
    y: number,
    size: number,
    color: string,
    ctx: CanvasRenderingContext2D
  ) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.rect(x, y, size, size);
    ctx.fill();
    ctx.closePath();
  }

  private getDeltaTime(t: number) {
    if (this.lastTime === 0) {
      this.lastTime = t;
      return 0;
    }
    const dt = t - this.lastTime;
    this.lastTime = t;
    return dt;
  }

  private async render(t: number, params: DrawParams) {
    const dt = this.getDeltaTime(t);
    const sceneDescription = await this.scene.getScene({
      dt,
      frameRate: this.frameRate,
      canvasSize: params.ctx.canvas.width,
    });
    const { ctx } = params;
    ctx.fillStyle = "blue";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const cellSize = ctx.canvas.width / sceneDescription.numberOfCells;

    for (let x = 0; x < sceneDescription.numberOfCells; x++) {
      for (let y = 0; y < sceneDescription.numberOfCells; y++) {
        const color = sceneDescription.cellColors[x][y];
        this.cell(x * cellSize, y * cellSize, cellSize, color, ctx);
      }
    }

    requestAnimationFrame((t) => this.render(t, params));
  }

  start(params: DrawParams) {
    requestAnimationFrame((t) => this.render(t, params));
  }

  setFrameRate(frameRate: number) {
    this.frameRate = frameRate;
  }

  destroy() {
    this.scene.destroy();
    Engine.instance = undefined;
  }
}
