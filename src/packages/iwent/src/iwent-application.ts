import { IwentModule } from './iwent-module';
import { RelationalSchema } from '@daita/orm';
import { Iwent } from './iwent';
import { Client } from '@daita/relational/client/client';

export class IwentApplication {
  private readonly modules: IwentModule[] = [];
  constructor(public name: string, public schema: RelationalSchema) {}

  module(module: IwentModule) {
    this.modules.push(module);
  }

  getEventTypes(): string[] {
    const eventTypes = new Set<string>();
    for (const module of this.modules) {
      for (const eventType of module.getEventTypes()) {
        eventTypes.add(eventType);
      }
    }
    return Array.from(eventTypes);
  }

  async process(state: Client<any>, iwent: Iwent) {
    for (const module of this.modules) {
      await module.process(state, iwent);
    }
  }
}
