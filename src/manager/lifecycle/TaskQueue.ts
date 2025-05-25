import { CancellablePromise, createCancellableTimer } from "./CancelAbles";

type Task = {
  fn: () => CancellablePromise<void>; // Function that returns a Promise
  timeout: number; // Time (ms) allowed for the function to complete
  retries: number; // Number of retry attempts
  onFinish?: () => void;
};

export class TaskQueue {
  nowTaskIndex = 0;
  tasks: Task[] = [];

  // Add a task to the queue
  addTask(fn: () => CancellablePromise<void>, timeout: number, retries: number, onFinish?: () => void) {
    this.tasks.push({ fn, timeout, retries, onFinish });
  }

  // Run the tasks in the queue sequentially
  async run() {
    for (const task of this.tasks) {
      await this.runTaskWithTimeoutAndRetries(task);
    }
  }

  private async runTaskWithTimeoutAndRetries(task: Task) {
    let attempts = 0;
  
    while (attempts <= task.retries) {
      try {
        // Run the task with timeout
        console.log("Run in ", attempts);
        await this.runWithTimeout(task.fn, task.timeout);
        console.log("Task completed successfully");
  
        // Remove task from tasks array after successful completion
        const taskIndex = this.tasks.indexOf(task);
        if (taskIndex !== -1) {
          this.tasks.splice(taskIndex, 1);
        }
  
        // If there's an onFinish callback, call it
        if (task.onFinish) {
          task.onFinish();
        }
  
        return; // If successful, move to the next task
      } catch (error) {
        console.log(error);
        console.log(`Task failed on attempt ${attempts}. Retrying...`);
        attempts++;
  
        if (attempts > task.retries) {
          console.log("Task failed after maximum retries. Moving to the next task.");
          return;
        }
      }
    }
  }
  
  // Run a function with a timeout
  private runWithTimeout(fn: () => CancellablePromise<void>, timeout: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const timer = createCancellableTimer(() => reject(new Error("Task timed out")), timeout);
      fn()
        .promise.then(() => {
          timer.clear(); // Clear timeout if function completes
          resolve();
        })
        .catch((error: any) => {
          timer.clear(); // Clear timeout if the function fails
          reject(error);
        });
    });
  }
}
