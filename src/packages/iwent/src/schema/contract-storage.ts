import { Client } from '@daita/relational';
import { CreateSchemaSql } from '@daita/relational';
import { field, table } from '@daita/relational';
import { join } from '@daita/relational';
import { equal } from '@daita/relational';
import { asc } from '@daita/relational';
import { IwentContract } from '../iwent-contract';
import { DaitaEvent } from './event';
import { DaitaContract } from './contract';
import { DaitaContractChange } from './contract-change';
import { Iwent } from '../iwent';
import { json } from '@daita/relational';
import { RelationalStorage } from '@daita/relational';

export class ContractStorage extends RelationalStorage {
  async initialize(client: Client<any>) {
    const createSchema: CreateSchemaSql = { createSchema: 'daita', ifNotExists: true };
    if (client.supportsQuery(createSchema)) {
      await client.exec(createSchema);
    }

    await client.exec({
      createTable: table(DaitaEvent),
      ifNotExists: true,
      columns: [
        { name: 'id', type: this.options.idType.type, size: this.options.idType.size, notNull: true, primaryKey: true },
        {
          name: 'type',
          type: this.options.idType.type,
          size: this.options.idType.size,
          notNull: true,
        },
        {
          name: 'payload',
          type: 'json',
          notNull: true,
        },
        {
          name: 'createdAt',
          type: 'date',
          notNull: true,
        },
        {
          name: 'userId',
          type: 'string',
          notNull: false,
        },
        {
          name: 'userIssuer',
          type: 'string',
          notNull: false,
        },
      ],
    });
    await client.exec({
      createTable: table(DaitaContract),
      ifNotExists: true,
      columns: [
        {
          name: 'id',
          type: this.options.idType.type,
          size: this.options.idType.size,
          notNull: true,
          primaryKey: true,
        },
        {
          name: 'after',
          type: 'string',
          notNull: false,
        },
      ],
    });
    await client.exec({
      createTable: table(DaitaContractChange),
      ifNotExists: true,
      columns: [
        {
          name: 'contractId',
          type: this.options.idType.type,
          size: this.options.idType.size,
          notNull: true,
          primaryKey: true,
        },
        {
          name: 'change',
          type: 'json',
          notNull: true,
        },
        { name: 'index', type: 'number', notNull: true, primaryKey: true },
      ],
      foreignKey: {
        migration: {
          key: ['contractId'],
          references: {
            table: table(DaitaContract),
            primaryKey: ['id'],
          },
        },
      },
    });
  }

  async addEvent(event: Iwent) {
    return this.ensureInitialized(async (client) => {
      await client.insert({
        into: table(DaitaEvent),
        insert: {
          id: event.id,
          type: event.type,
          payload: json(event.payload),
          userId: event.userId,
          userIssuer: event.userIssuer,
          createdAt: event.createdAt,
        },
      });
    });
  }

  async getEvent(id: string) {
    return this.ensureInitialized(async (client) =>
      client.selectFirst<Iwent>({
        select: {
          id: field(DaitaEvent, 'id'),
          type: field(DaitaEvent, 'type'),
          createdAt: field(DaitaEvent, 'createdAt'),
          userIssuer: field(DaitaEvent, 'userIssuer'),
          userId: field(DaitaEvent, 'userId'),
          payload: field(DaitaEvent, 'payload'),
        },
        from: table(DaitaEvent),
        where: equal(field(DaitaEvent, 'id'), id),
      }),
    );
  }

  async getContract(): Promise<IwentContract[]> {
    return this.ensureInitialized(async (client) => {
      const steps = await client.select({
        select: {
          id: field(DaitaContract, 'id'),
          after: field(DaitaContract, 'after'),
          index: field(DaitaContractChange, 'index'),
          change: field(DaitaContractChange, 'change'),
        },
        from: table(DaitaContractChange),
        join: [join(DaitaContract, equal(field(DaitaContract, 'id'), field(DaitaContractChange, 'contractId')))],
        orderBy: asc(field(DaitaContractChange, 'index')),
      });

      const contractMap = steps.reduce<{ [key: string]: IwentContract }>((contracts, step) => {
        if (!contracts[step.id]) {
          contracts[step.id] = { id: step.id, after: step.after, changes: [] };
        }
        contracts[step.id].changes.push(JSON.parse(step.change));
        return contracts;
      }, {});

      return Object.keys(contractMap).map((id) => contractMap[id]);
    });
  }

  async addContract(client: Client<any>, contract: IwentContract) {
    return this.ensureInitialized(async (client) => {
      await client.exec({
        insert: { id: contract.id, after: contract.after },
        into: table(DaitaContract),
      });

      let index = 0;
      for (const change of contract.changes) {
        await client.exec({
          insert: {
            contractId: contract.id,
            change: JSON.stringify(change),
            index: index++,
          },
          into: table(DaitaContractChange),
        });
      }
    });
  }
}
