export class AsyncMutex {
  private locked = false;
  private waiting: (() => void)[] = [];

  async acquire(): Promise<() => void> {
    return new Promise((resolve) => {
      if (!this.locked) {
        this.locked = true;
        resolve(() => this.release());
      } else {
        this.waiting.push(() => {
          this.locked = true;
          resolve(() => this.release());
        });
      }
    });
  }

  private release(): void {
    if (this.waiting.length > 0) {
      const next = this.waiting.shift();
      next?.();
    } else {
      this.locked = false;
    }
  }
}
