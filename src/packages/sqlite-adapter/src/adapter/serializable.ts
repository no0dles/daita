import { Defer } from '@daita/common';

interface SerializableAction<T> {
  (): Promise<T> | T;
}

interface SerializableQueueItem<T> {
  action: SerializableAction<T>;
  defer: Defer<T>;
}

export class Serializable {
  private nextActions: SerializableQueueItem<any>[] = [];
  private currentAction: SerializableQueueItem<any> | null = null;

  run<T>(action: SerializableAction<T>): Promise<T> {
    const defer = new Defer<T>();
    const item: SerializableQueueItem<T> = { action, defer };
    if (this.currentAction) {
      this.nextActions.push(item);
    } else {
      this.execute(item);
    }
    return defer.promise;
  }

  private async execute(queueItem: SerializableQueueItem<any>) {
    this.currentAction = queueItem;
    try {
      const result = await this.currentAction.action();
      this.currentAction.defer.resolve(result);
    } catch (e) {
      this.currentAction.defer.reject(e);
    }

    const nextAction = this.nextActions.shift();
    if (!nextAction) {
      this.currentAction = null;
      return;
    }
    this.execute(nextAction);
  }
}
