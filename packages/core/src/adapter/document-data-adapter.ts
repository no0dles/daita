import { Doc } from '../context/types/document';

export interface DocumentDataAdapter {
  get(collection: string, id: string): Promise<Doc | null>;

  create(collection: string, data: Doc): Promise<void>;

  update(collection: string, id: string, data: Doc): Promise<void>;

  delete(collection: string, id: string): Promise<void>;

  query(collection: string, filter: any): Promise<Doc[]>;
}
