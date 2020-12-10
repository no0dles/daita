import { Sql } from '../../../packages/relational/sql/sql';

export type Db = 'postgres' | 'sqlite' | 'mariadb';
export const allDbs: Db[] = ['postgres', 'sqlite', 'mariadb'];

export interface Section {
  title: string;
  description?: string;
  id: string;
  snippets?: Snippet[];
  sections?: Section[];
}

export interface Snippet {
  description?: string;
  code?: Sql<any>;
  bash?: string;
  typescript?: string;
  filename?: string;
  supportedBy?: Db[];
}
