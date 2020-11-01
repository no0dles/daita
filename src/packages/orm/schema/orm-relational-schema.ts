import { RelationalMapper } from '../context/relational-mapper';
import { RelationalSchemaDescription } from './description/relational-schema-description';
import { MigrationTree } from '../migration/migration-tree';
import { Rule } from '../../relational/permission/description/rule';

export interface OrmRelationalSchema {
  schema: string | null;

  getSchemaDescription(): RelationalSchemaDescription;

  getRules(): Rule[];

  getMigrations(): MigrationTree;

  getMapper(): RelationalMapper;
}
