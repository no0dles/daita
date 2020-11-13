import { TransactionContext } from '../../../packages/orm';
import { ContextTestContext } from './context-test-context';
import { isKind } from '../../../packages/common';
import { MigrationTree } from '../../../packages/orm/migration/migration-tree';

export interface TransactionContextTestContext {
  context: TransactionContext<any>;
  migrationTree: MigrationTree;

  close(): Promise<void>;
}

export const isTransactionContextTestContext = (
  val: ContextTestContext | TransactionContextTestContext,
): val is TransactionContextTestContext =>
  isKind(val, ['context']) && typeof (<any>val.context).transaction === 'function';
