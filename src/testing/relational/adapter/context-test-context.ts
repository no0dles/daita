import { Context } from '../../../packages/orm';
import { TransactionContextTestContext } from './transaction-context-test-context';
import { isKind } from '../../../packages/common';
import { MigrationTree } from '../../../packages/orm/migration/migration-tree';

export interface ContextTestContext {
  context: Context<any>;
  migrationTree: MigrationTree;

  close(): Promise<void>;
}

export const isContextTestContext = (
  val: ContextTestContext | TransactionContextTestContext,
): val is ContextTestContext => isKind(val, ['context']);
