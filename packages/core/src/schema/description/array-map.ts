
export class ArrayMap<T> {
  private map: { [key: string]: T } = {};
  public array: T[] = [];

  get(key: string): T | null {
    return this.map[key] ?? null;
  }

  add(key: string, value: T) {
    this.map[key] = value;
    this.array.push(value);
  }

  remove(key: string) {
    const item = this.map[key];
    const index = this.array.indexOf(item);
    if (index >= 0) {
      this.array.splice(index, 1);
    }
    delete this.map[key];
  }
}
