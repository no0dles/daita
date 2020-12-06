import { Sql } from '../../../packages/relational/sql/sql';

export type Db = 'postgres' | 'sqlite' | 'mariadb';
export const allDbs: Db[] = ['postgres', 'sqlite', 'mariadb'];

export interface Section {
  title: string;
  description?: string;
  id: string;
  snippets?: {
    description?: string;
    code: Sql<any>;
    supportedBy: Db[];
  }[];
  sections?: Section[];
}
