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
  sourceCodes: SnippetSourceCode[];
}

export interface SnippetSourceCode {
  title: string;
  code: string;
  type: string;
}
