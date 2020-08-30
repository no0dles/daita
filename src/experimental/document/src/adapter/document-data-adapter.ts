import { DocumentQuery } from "../query/document-query";
import { QueryResult } from "./query-result";
import { Doc } from "./doc";

export interface DocumentDataAdapter {
  create(collection: string, data: Doc): Promise<void>
  get(collection: string, id: string): Promise<Doc | null>;
  delete(collection: string, id: string): Promise<void>;
  update(collection: string, id: string, data: Doc): Promise<void>;
  query(collection: string, query: DocumentQuery): Promise<QueryResult>;
}
