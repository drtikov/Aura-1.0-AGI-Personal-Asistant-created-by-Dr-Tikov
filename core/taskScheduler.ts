// core/taskScheduler.ts
type Task = () => Promise<void>;

class TaskScheduler {
  private queue: Task[] = [];
  private isProcessing: boolean = false;

  /**
   * Schedules a task to be executed. The task is added to a queue
   * and will be run sequentially after all previously scheduled tasks are complete.
   * This method is non-blocking and returns immediately.
   * @param task The asynchronous function to execute.
   */
  public schedule(task: Task): void {
    this.queue.push(task);
    if (!this.isProcessing) {
      this.processQueue(); // Fire-and-forget to process in the background
    }
  }

  private async processQueue(): Promise<void> {
    this.isProcessing = true;
    while (this.queue.length > 0) {
      const task = this.queue.shift();
      if (task) {
        try {
          await task();
        } catch (error) {
          console.error("TaskScheduler: Error processing task:", error);
        }
      }
    }
    this.isProcessing = false;
  }
}

export const taskScheduler = new TaskScheduler();
