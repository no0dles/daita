import {TableInformation} from './table-information';
import {RelationalDataAdapter, RelationalTransactionAdapter} from '../adapter';
import {Constructable} from '../constructable';
import {RelationalSelectBuilder} from '../builder/relational-select-builder';
import {RelationalInsertBuilder} from '../builder/relational-insert-builder';
import {RelationalUpdateBuilder} from '../builder/relational-update-builder';
import {RelationalDeleteBuilder} from '../builder/relational-delete-builder';
import {getSqlTable} from '../builder/utils';

export interface RelationalCtx extends RelationalSelectCtx, RelationalDeleteCtx, RelationalUpdateCtx, RelationalInsertCtx {

}

export interface RelationalTransactionCtx extends RelationalCtx {
  transaction<T>(
    action: (adapter: RelationalCtx) => Promise<T>,
  ): Promise<T>;
}

export interface RelationalSelectCtx {
  select<T>(type: TableInformation<T>): RelationalSelectBuilder<T>;
}

export interface RelationalInsertCtx {
  insert<T>(type: TableInformation<T>): RelationalInsertBuilder<T>;
}

export interface RelationalUpdateCtx {
  update<T>(type: TableInformation<T>): RelationalUpdateBuilder<T>;
}

export interface RelationalDeleteCtx {
  delete<T>(type: TableInformation<T>): RelationalDeleteBuilder<T>;
}

export function deleteContext(dataAdapter: RelationalDataAdapter): RelationalDeleteCtx {
  const DeleteContext = getDeleteContext(Object, dataAdapter);
  return new DeleteContext();
}

export function selectContext(dataAdapter: RelationalDataAdapter): RelationalSelectCtx {
  const SelectContext = getSelectContext(Object, dataAdapter);
  return new SelectContext();
}

export function updateContext(dataAdapter: RelationalDataAdapter): RelationalUpdateCtx {
  const UpdateContext = getUpdateContext(Object, dataAdapter);
  return new UpdateContext();
}

export function insertContext(dataAdapter: RelationalDataAdapter): RelationalInsertCtx {
  const InsertContext = getInsertContext(Object, dataAdapter);
  return new InsertContext();
}

export function context(dataAdapter: RelationalDataAdapter): RelationalCtx {
  const Context = getContext(Object, dataAdapter);
  return new Context();
}

export function transactionContext(dataAdapter: RelationalTransactionAdapter): RelationalTransactionCtx {
  const TransactionContext = getTransactionContext(Object, dataAdapter);
  return new TransactionContext();
}

function getContext<TBase extends Constructable<any>>(base: TBase, dataAdapter: RelationalDataAdapter): Constructable<RelationalCtx> {
  return getDeleteContext(getInsertContext(getSelectContext(getUpdateContext(Object, dataAdapter), dataAdapter), dataAdapter), dataAdapter);
}

function getDeleteContext<TBase extends Constructable<any>>(base: TBase, dataAdapter: RelationalDataAdapter) {
  return class extends base {
    delete<T>(type: TableInformation<T>) {
      return new RelationalDeleteBuilder<T>(dataAdapter, getSqlTable(type));
    }
  };
}

export function getSelectContext<TBase extends Constructable<any>>(base: TBase, dataAdapter: RelationalDataAdapter) {
  return class extends base {
    select<T>(type: TableInformation<T>): RelationalSelectBuilder<T> {
      return new RelationalSelectBuilder<T>(dataAdapter, getSqlTable(type));
    }
  };
}

export function getUpdateContext<TBase extends Constructable<any>>(base: TBase, dataAdapter: RelationalDataAdapter) {
  return class extends base {
    update<T>(type: TableInformation<T>): RelationalUpdateBuilder<T> {
      return new RelationalUpdateBuilder<T>(dataAdapter, getSqlTable(type));
    }
  };
}

export function getInsertContext<TBase extends Constructable<any>>(base: TBase, dataAdapter: RelationalDataAdapter) {
  return class extends base {
    insert<T>(type: TableInformation<T>): RelationalInsertBuilder<T> {
      return new RelationalInsertBuilder<T>(dataAdapter, getSqlTable(type));
    }
  };
}

export function getTransactionContext<TBase extends Constructable<any>>(base: TBase, dataAdapter: RelationalTransactionAdapter): Constructable<RelationalTransactionCtx> {
  const Context = getContext(base, dataAdapter);
  return class extends Context {
    async transaction<T>(
      action: (adapter: RelationalCtx) => Promise<T>,
    ): Promise<T> {
      const ctx = new Context();
      return await action(ctx);
    }
  };
}