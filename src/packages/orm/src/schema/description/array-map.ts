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

  exists(key: string): boolean {
    return key in this.map;
  }

  clear() {
    this.array = [];
    this.map = {};
  }

  update(key: string, value: T) {
    const oldValue = this.map[key];
    if (!oldValue) {
      throw new Error('nothing to update for key ' + key);
    }
    const oldIndex = this.array.indexOf(oldValue);
    this.array.splice(oldIndex, 1, value);
    this.map[key] = value;
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
