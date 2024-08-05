import Scene from "./scene";

interface DrawParams {
  ctx: CanvasRenderingContext2D;
  numberOfCells: number;
}

export default class Engine {
  private static instance: Engine | undefined = undefined;
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

  private render(t: number, params: DrawParams) {
    const dt = this.getDeltaTime(t);
    const sceneDescription = this.scene.getScene(dt, params.numberOfCells);

    const { ctx, numberOfCells } = params;
    ctx.fillStyle = "blue";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const cellSize = ctx.canvas.width / numberOfCells;

    for (let x = 0; x < numberOfCells; x++) {
      for (let y = 0; y < numberOfCells; y++) {
        const color = sceneDescription.cellColors[x][y];
        this.cell(x * cellSize, y * cellSize, cellSize, color, ctx);
      }
    }

    requestAnimationFrame((t) => this.render(t, params));
  }

  start(params: DrawParams) {
    requestAnimationFrame((t) => this.render(t, params));
  }

  destroy() {
    this.scene.destroy();
    Engine.instance = undefined;
  }
}
