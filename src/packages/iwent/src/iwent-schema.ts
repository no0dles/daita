import { ObjectType } from '@daita/common';
import { IwentContract } from './iwent-contract';

export interface IwentSchema {
  events: { [key: string]: IwentSchemaEvent };
  modules: { [key: string]: IwentSchemaModule };
}

export interface IwentSchemaEvent {
  type: ObjectType;
  requiresRole?: string;
  requiresAuthentication: boolean;
}

export interface IwentSchemaModule {
  events: { [key: string]: IwentSchemaModuleEvent };
  requiresModules: string[];
}

export interface IwentSchemaModuleEvent {
  handlers: string[];
}

export function getSchema(contracts: IwentContract[]): IwentSchema {
  const schema: IwentSchema = { events: {}, modules: {} };

  // TODO tree abstraction
  for (const contract of contracts) {
    for (const change of contract.changes) {
      if (change.type === 'add_event' || change.type === 'update_event') {
        schema.events[change.eventName] = {
          type: change.eventType,
          requiresAuthentication: change.requiresAuthentication,
          requiresRole: change.requiresRole,
        };
      } else if (change.type === 'add_event_handler') {
        // TODO
      } else if (change.type === 'remove_event_handler') {
        // TODO
      }
    }
  }

  return schema;
}
