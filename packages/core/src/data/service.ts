import {DocumentDataAdapter} from '../adapter';
import {MigrationSchema} from '../schema/migration-schema';

export class DataService {
  constructor(private dataAdapter: DocumentDataAdapter,
              private schema: MigrationSchema) {}

  async get(collection: string, id: string) {
    const data = await this.dataAdapter.get(collection, id);
    if (!data) {
      return null;
    }
    return this.mapFromBase(collection, data);
  }

  async create(collection: string, data: any) {
    const baseData = this.mapToBase(collection, data);
    await this.dataAdapter.create(collection, baseData);
  }

  async update(collection: string, id: string, data: any) {
    const baseData = this.mapToBase(collection, data);
    await this.dataAdapter.update(collection, id, baseData);
  }

  async delete(collection: string, id: string) {
    await this.dataAdapter.delete(collection, id);
  }

  async query(collection: string, filter: any) {
    const results = await this.dataAdapter.query(collection, filter);
    return results.map(result => this.mapFromBase(collection, result));
  }

  private mapToBase(collection: string, data: any) {
    const newData: any = {};
    const schemaCollection = this.schema.collection(collection);
    if (!schemaCollection) {
      throw new Error(`missing schema for collection ${collection}`);
    }
    for (const key of schemaCollection.fieldNames) {
      const schemaField = schemaCollection.field(key);
      if (schemaField) {
        newData[schemaField.baseFieldName] = data[key];
      }
    }
    return newData;
  }

  private mapFromBase(collection: string, data: any) {
    const newData: any = {};
    const schemaCollection = this.schema.collection(collection);
    if (!schemaCollection) {
      throw new Error(`missing schema for collection ${collection}`);
    }
    for (const key of schemaCollection.fieldNames) {
      const schemaField = schemaCollection.field(key);
      if (schemaField) {
        newData[key] = data[schemaField.baseFieldName];
      }
    }
    return newData;
  }
}
