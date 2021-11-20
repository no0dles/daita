import { RelationalMapper } from '../context/relational-mapper';
import { MigrationTree } from '../migration/migration-tree';
import { Rule } from '@daita/relational';

export interface OrmRelationalSchema {
  schema: string | null;

  getRules(): Rule[];

  getMigrations(): MigrationTree;

  getMapper(): RelationalMapper;
}
