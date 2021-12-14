import { Context } from './context';
import { RelationalBaseContext } from './relational-base-context';
import { RelationalDataAdapter } from '@daita/relational';
import { RuleContext } from '@daita/relational';
import { MigrationTree } from '../migration/migration-tree';
import { Resolvable } from '@daita/common';
import { AuthorizedContext } from './authorized-context';
import { RelationalAuthorizedContext } from './relational-authorized-context';

export class RelationalContext extends RelationalBaseContext implements Context<any> {
  constructor(adapter: RelationalDataAdapter<any>, migrationTree: Resolvable<MigrationTree>) {
    super(adapter, migrationTree);
  }

  authorize(auth: RuleContext<any>): AuthorizedContext<any> {
    return new RelationalAuthorizedContext(this.dataAdapter, this.migrationTree, auth);
  }
}
