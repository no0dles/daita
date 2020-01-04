export class Debouncer {
  private timeout: NodeJS.Timeout | null = null;

  constructor(private trigger: () => any, private wait: number) {}

  clear() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  bounce() {
    this.clear();
    this.timeout = setTimeout(() => this.flush(), this.wait);
  }

  flush() {
    this.trigger();
    this.clear();
  }
}
