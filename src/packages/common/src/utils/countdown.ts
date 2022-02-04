export class Countdown {
  private timeoutHandle: any | null = null;

  constructor(private trigger: () => any) {}

  setExpire(time: number) {
    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
    }
    const now = new Date().getTime();
    if (time > now) {
      this.timeoutHandle = setTimeout(() => this.trigger(), time - now);
    } else {
      this.trigger();
    }
  }
}
