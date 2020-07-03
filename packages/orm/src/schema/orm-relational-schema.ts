import { RelationalSchemaDescription } from '../schema';
import { Rule } from '@daita/relational';
import { MigrationTree } from '../migration';
import { RelationalMapper } from '../context';

export interface OrmRelationalSchema {
  schema: string | null;

  getSchemaDescription(): RelationalSchemaDescription;

  getRules(): Rule[];

  getMigrations(): MigrationTree;

  getMapper(): RelationalMapper;
}
