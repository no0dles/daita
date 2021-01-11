import { HttpTransactionAdapter } from './http-transaction-adapter';
import { RelationalMigrationAdapter } from '../orm/adapter/relational-migration-adapter';
import { MigrationPlan } from '../orm/context/relational-migration-context';
import { MigrationDescription } from '../orm/migration/migration-description';
import { IwentAdapter } from '../iwent/iwent-adapter';
import { Iwent } from '../iwent/iwent';
import { IwentContract } from '../iwent/iwent-contract';

export class HttpAdapter extends HttpTransactionAdapter implements RelationalMigrationAdapter<any>, IwentAdapter {
  async applyMigration(schema: string, migrationPlan: MigrationPlan): Promise<void> {
    const http = await this.http.get();
    const result = await http.json<{ message?: string }>({
      path: `api/orm/${schema}/migrations`,
      method: 'POST',
      data: { migrationPlan },
      authorized: true,
    });
    if (result.statusCode >= 400) {
      throw new Error(result.data.message);
    }
  }

  async getAppliedMigrations(schema: string): Promise<MigrationDescription[]> {
    const http = await this.http.get();
    //TODO better response typing
    const result = await http.json<{ message?: string; migrations: MigrationDescription[] }>({
      method: 'GET',
      path: `api/orm/${schema}/migrations`,
      authorized: true,
    });
    if (result.statusCode >= 400) {
      throw new Error(result.data.message);
    }
    return result.data.migrations;
  }

  async addEvent(event: Iwent): Promise<void> {
    const http = await this.http.get();
    await http.json({
      method: 'POST',
      path: `api/iwent/event/${event.type}`,
      data: {
        payload: event.payload,
        id: event.id,
      },
      authorized: true,
    });
  }

  applyContract(contract: IwentContract): Promise<void> {
    return Promise.resolve(undefined);
  }

  getContracts(): Promise<IwentContract[]> {
    return Promise.resolve([]);
  }

  async getEvent(id: string): Promise<Iwent | null> {
    const http = await this.http.get();
    const event = await http.json<Iwent>({
      method: 'GET',
      authorized: true,
      path: `api/iwent/event/${id}`,
    });
    if (event.statusCode === 404) {
      return null;
    }
    if (event.statusCode === 200) {
      return event.data;
    }
    throw new Error((<any>event.data).message);
  }
}
