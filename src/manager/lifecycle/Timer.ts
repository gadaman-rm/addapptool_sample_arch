export type TimerCallback = {
  resetExeTime: number;
  exeTime: number;
  timerCallback: () => void;
  repeatable: boolean;
};

export class Timer {
  private startTime: number | null = null;
  private pauseTimer: boolean = false;
  private elapsedTime: number = 0;
  private timerId: number | null = null;
  private timerCallbackArray: TimerCallback[] = [];

  start(): void {
    if (this.timerId !== null) {
      console.log("Timer is already running.");
      return;
    }
    this.startTime = Date.now();
    this.timerId = window.setInterval(() => {
      this.elapsedTime = Date.now() - this.startTime!;
      //console.log(this.getElapsedTime());
      if (!this.pauseTimer) this.checkCallbacks();
    }, 1000);
  }

  pause(): void {
    this.pauseTimer = true;
  }

  reset(): void {
    this.startTime = Date.now();
    this.elapsedTime = 0;
    this.timerCallbackArray.forEach((callBack) => {
      callBack.exeTime = callBack.resetExeTime;
    });
    console.log("Timer reset.");
  }

  remove(): void {
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
    }
    this.startTime = null;
    this.elapsedTime = 0;
    this.timerId = null;
    this.timerCallbackArray = [];
    console.log("Timer removed.");
  }

  getElapsedTime(): string {
    const totalSeconds = Math.floor(this.elapsedTime / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
  }

  addCallback(exeTime: number, timerCallback: () => void, repeatable: boolean): void {
    this.timerCallbackArray.push({ resetExeTime: exeTime, exeTime, timerCallback, repeatable });
  }

  private checkCallbacks(): void {
    this.timerCallbackArray.forEach((cb, index) => {
      if (this.elapsedTime >= cb.exeTime) {
        try {
          cb.timerCallback();
        } catch (e: any) {
          console.log("Error on run callback:\n");
          console.log(e.stack);
        }
        if (cb.repeatable) {
          cb.exeTime += cb.exeTime;
        } else {
          this.timerCallbackArray.splice(index, 1);
        }
      }
    });
  }

  private pad(num: number): string {
    return num.toString().padStart(2, "0");
  }
}

// Example usage:
// const timer = new Timer();
// timer.addCallback(5, () => console.log("5 seconds passed!"));
// timer.addCallback(10, () => console.log("10 seconds passed!"));
// timer.start();
// setTimeout(() => timer.pause(), 15000);
// setTimeout(() => timer.reset(), 20000);
// setTimeout(() => timer.remove(), 30000);
