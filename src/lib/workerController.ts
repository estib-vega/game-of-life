import UpdateCellColors from "../worker/updateCellColors?worker";

export interface TaskDescription {
  cellColors: string[][];
  start: number;
  end: number;
}

function workerCorrespondance(
  worker: Worker,
  taskDescription: TaskDescription
): Promise<TaskDescription> {
  return new Promise((resolve, reject) => {
    worker.postMessage(taskDescription);

    worker.onmessage = (event) => {
      const taskDescription = event.data;
      resolve(taskDescription);
    };

    worker.onerror = (error) => {
      reject(error);
    };
  });
}

export default class WorkerController {
  private worker1: Worker;
  private worker2: Worker;
  private worker3: Worker;
  private worker4: Worker;
  private isRunning = false;

  constructor() {
    this.worker1 = new UpdateCellColors();
    this.worker2 = new UpdateCellColors();
    this.worker3 = new UpdateCellColors();
    this.worker4 = new UpdateCellColors();
  }

  async calculateCells(cellColors: string[][]): Promise<string[][]> {
    if (!this.isRunning) {
      this.isRunning = true;

      const firstEnd = Math.floor(cellColors.length / 4);
      const secondStart = firstEnd;
      const secondEnd = Math.floor(cellColors.length / 2);
      const thirdStart = secondEnd;
      const thirdEnd = Math.floor((cellColors.length / 4) * 3);
      const fourthStart = thirdEnd;
      const fourthEnd = cellColors.length;

      const tasks = await Promise.all([
        workerCorrespondance(this.worker1, {
          cellColors,
          start: 0,
          end: firstEnd,
        }),
        workerCorrespondance(this.worker2, {
          cellColors,
          start: secondStart,
          end: secondEnd,
        }),
        workerCorrespondance(this.worker3, {
          cellColors,
          start: thirdStart,
          end: thirdEnd,
        }),
        workerCorrespondance(this.worker4, {
          cellColors,
          start: fourthStart,
          end: fourthEnd,
        }),
      ]);

      const updatedCellColors: string[][] = new Array(cellColors.length)
        .fill(null)
        .map(() => new Array(cellColors.length).fill(null));

      for (const task of tasks) {
        for (let i = task.start; i < task.end; i++) {
          updatedCellColors[i] = task.cellColors[i];
        }
      }

      this.isRunning = false;
      return updatedCellColors;
    }
    return cellColors;
  }

  stop() {
    this.isRunning = false;
  }

  terminate() {
    this.worker1.terminate();
    this.worker2.terminate();
    this.worker3.terminate();
    this.worker4.terminate();
  }
}
