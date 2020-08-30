import { RelationalSchemaDescription } from '../schema';
import { MigrationTree } from '../migration';
import { RelationalMapper } from '../context';
import {Rule} from '../../relational/permission/description';

export interface OrmRelationalSchema {
  schema: string | null;

  getSchemaDescription(): RelationalSchemaDescription;

  getRules(): Rule[];

  getMigrations(): MigrationTree;

  getMapper(): RelationalMapper;
}
