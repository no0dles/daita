import { IwentApplication } from './iwent-application';
import { Closable } from '@daita/node';
import { MigrationContext } from '@daita/orm';
import { createLogger } from '@daita/common';
import { isIwentAdapter, IwentAdapter } from './iwent-adapter';

const logger = createLogger({ package: 'iwent' });

export class IwentPollProcessor {
  constructor(private application: IwentApplication) {}

  run(context: MigrationContext<any>): Closable {
    const adapter = context.migrationAdapter;
    if (!isIwentAdapter(adapter)) {
      throw new Error('not an iwent adapter');
    }

    return {
      async close(): Promise<void> {},
    };
  }

  async process(context: MigrationContext<any>, adapter: IwentAdapter) {
    await context.transaction(async (trx) => {});
  }
}

export interface ProcessOptions {
  application: IwentApplication;
  context: MigrationContext<any>;
}

export function pollProcess(options: ProcessOptions) {}

export async function process(options: ProcessOptions) {
  const adapter = options.context.migrationAdapter;
  if (!isIwentAdapter(adapter)) {
    throw new Error('not an iwent adapter');
  }

  logger.info('migrate schema');
  await options.context.forSchema(options.application.schema).migrate();

  const eventTypes = options.application.getEventTypes();
}

export interface GetEventsOptions {
  processorKey: string;
  eventTypes?: string[];
  limit: number;
}

export interface ConfirmEventOptions {
  eventId: string;
  processorKey: string;
  handlers: { handlerKey: string; errorMessage?: string }[];
}
