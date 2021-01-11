import { Constructable } from '../common/types/constructable';
import { IwentHandler } from './iwent-handler';
import { Iwent } from './iwent';
import { Client } from '../relational/client/client';

export class IwentModule {
  private readonly events: { [key: string]: Constructable<IwentHandler<any>>[] } = {};

  constructor(public readonly name: string) {}

  getEventTypes() {
    return Object.keys(this.events);
  }

  handle<T>(event: Constructable<T>, handler: Constructable<IwentHandler<T>>) {
    if (!this.events[event.name]) {
      this.events[event.name] = [];
    }
    this.events[event.name].push(handler);
  }

  process(state: Client<any>, iwent: Iwent) {
    const handlers = this.events[iwent.type] || [];
    for (const handler of handlers) {
      const instance = new handler();
      instance.handle(iwent.payload, {
        metadata: {
          createdAt: iwent.createdAt,
          eventId: iwent.id,
          userIssuer: iwent.userIssuer,
          userId: iwent.userId,
        },
        state,
      });
    }
  }
}
