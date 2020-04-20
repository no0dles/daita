import {TableInformation} from './table-information';
import {
  Constructable, getSqlSchemaTable,
  RelationalDataAdapter,
  RelationalDeleteBuilder,
  RelationalInsertBuilder,
  RelationalSelectBuilder,
  RelationalTransactionAdapter,
  RelationalUpdateBuilder
} from "@daita/core";

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
      return new RelationalDeleteBuilder<T>(dataAdapter, {delete: getSqlSchemaTable(type)});
    }
  };
}

export function getSelectContext<TBase extends Constructable<any>>(base: TBase, dataAdapter: RelationalDataAdapter) {
  return class extends base {
    select<T>(type: TableInformation<T>): RelationalSelectBuilder<T> {
      return new RelationalSelectBuilder<T>(dataAdapter, {select: [], from: getSqlSchemaTable(type)});
    }
  };
}

export function getUpdateContext<TBase extends Constructable<any>>(base: TBase, dataAdapter: RelationalDataAdapter) {
  return class extends base {
    update<T>(type: TableInformation<T>): RelationalUpdateBuilder<T> {
      return new RelationalUpdateBuilder<T>(dataAdapter, {update: getSqlSchemaTable(type), set: {}});
    }
  };
}

export function getInsertContext<TBase extends Constructable<any>>(base: TBase, dataAdapter: RelationalDataAdapter) {
  return class extends base {
    insert<T>(type: TableInformation<T>): RelationalInsertBuilder<T> {
      return new RelationalInsertBuilder<T>(dataAdapter, {insert: getSqlSchemaTable(type), values: []});
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
