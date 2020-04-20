export class Debouncer {
  private timeoutHandle: number | null = null;
  timeout = 0;

  constructor(private trigger: () => any, private wait: number) {
    this.bounce();
  }

  clear() {
    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
      this.timeoutHandle = null;
    }
  }

  bounce() {
    this.clear();
    this.timeout = new Date().getTime() + this.wait;
    this.timeoutHandle = setTimeout(() => this.flush(), this.wait);
  }

  flush() {
    this.trigger();
    this.clear();
  }
}
