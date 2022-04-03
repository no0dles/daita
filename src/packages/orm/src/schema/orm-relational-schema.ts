import { RelationalMapper } from '../context/relational-mapper';
import { MigrationTree } from '../migration/migration-tree';
import { Rule } from '@daita/relational';

export interface OrmRelationalSchema<TSql> {
  schema: string | null;

  getRules(): Rule[];

  getMigrations(): MigrationTree<TSql>;

  getMapper(): RelationalMapper;
}

export const isOrmRelationalSchema = (val: any): val is OrmRelationalSchema<any> =>
  typeof val.getRules === 'function' && typeof val.getMigrations === 'function' && typeof val.getMapper === 'function';
