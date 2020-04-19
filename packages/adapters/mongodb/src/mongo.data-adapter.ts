import { MongoClient } from 'mongodb';
import * as uuid from 'uuid';
import { MongoDataDocument } from './mongo-data-document';
import {DocumentDataAdapter, Doc} from '@daita/core';

export class MongoDataAdapter implements DocumentDataAdapter {
  client: MongoClient;
  connected = false;

  constructor(private uri: string) {
    this.client = new MongoClient(uri, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
  }

  private async getDb() {
    if (!this.connected) {
      await this.client.connect();
      this.connected = true;
    }

    return await this.client.db();
  }

  async create(collection: string, data: Doc): Promise<void> {
    const db = await this.getDb();
    const dataCollection = db.collection<MongoDataDocument>(
      `data_${collection}`,
    );
    const operationId = uuid.v1();
    await dataCollection.insertOne({
      _id: data.id,
      data,
      operationId,
    });
  }

  async delete(collection: string, id: string): Promise<void> {
    const db = await this.getDb();
    const dataCollection = db.collection<MongoDataDocument>(
      `data_${collection}`,
    );
    await dataCollection.deleteOne({
      _id: id,
    });
  }

  async get(collection: string, id: string): Promise<Doc | null> {
    const db = await this.getDb();
    const dataCollection = db.collection<MongoDataDocument>(
      `data_${collection}`,
    );
    const data = await dataCollection.findOne({ _id: id });
    if (!data) {
      return null;
    }
    return data.data;
  }

  async update(collection: string, id: string, data: Doc): Promise<void> {
    const db = await this.getDb();
    const dataCollection = db.collection<MongoDataDocument>(
      `data_${collection}`,
    );

    const operationId = uuid.v1();
    await dataCollection.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          data,
          operationId,
        },
      },
    );
  }

  async query(collection: string, filter: any): Promise<Doc[]> {
    const db = await this.getDb();
    const dataCollection = db.collection<MongoDataDocument>(
      `data_${collection}`,
    );

    const results = await dataCollection.find(filter).toArray();
    return results.map(result => result.data);
  }
}
