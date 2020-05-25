import { RelationalTransactionAdapter, SqlDdlQuery } from "@daita/relational";
import { RelationalSchemaDescription } from "../schema/description/relational-schema-description";
import { merge } from "@daita/common";

export class MigrationExecution {
  async init(dataAdapter: RelationalTransactionAdapter) {
    await dataAdapter.exec({createSchema: 'daita', ifNotExists: true});
    await dataAdapter.exec({
      createTable: { schema: "daita", table: "migrations" },
      ifNotExist: true,
      fields: [
        { name: "id", type: "string", notNull: true, primaryKey: true }
      ]
    });
  }

  async exists(id: string, dataAdapter: RelationalTransactionAdapter) {
    const result = await dataAdapter.exec({
      select: ["id"],
      from: { schema: "daita", table: "migrations" },
      where: {
        left: { field: "id" },
        operand: "=",
        right: id
      },
      limit: 1
    });
    return result.rowCount > 0;
  }

  plan(
    current: RelationalSchemaDescription,
    target: RelationalSchemaDescription
  ): SqlDdlQuery[] {
    const queries: SqlDdlQuery[] = [];

    const tables = merge(current.tables, target.tables, (first, second) => first.key === second.key);
    for (const addedTable of tables.added) {
      queries.push({
        createTable: addedTable.name,
        fields: addedTable.fields.map(field => {
          return {
            name: field.name,
            type: field.type,
            primaryKey: field.isPrimaryKey
          };
        })
      });
    }

    for (const mergedTable of tables.merge) {
      const primaryKeys = merge(mergedTable.current.primaryKeys, mergedTable.target.primaryKeys, (first, second) => first === second);
      for (const addedPrimaryKey of primaryKeys.added) {
        throw new Error("cant add primary key after creation of table");
      }
      for (const addedPrimaryKey of primaryKeys.removed) {
        throw new Error("cant drop primary key after creation of table");
      }

      const fields = merge(mergedTable.current.fields, mergedTable.target.fields, (first, second) => first.key === second.key);

      for (const addedField of fields.added) {
        queries.push({
          alterTable: mergedTable.current.name,
          add: {
            column: addedField.name,
            type: addedField.type as any //TODO type support check
          }
        });
      }

      for (const mergedField of fields.merge) {
        if (mergedField.current.type !== mergedField.target.type) {
          throw new Error("changing type is not supported yet");
        }

        if (mergedField.target.required !== mergedField.current.required) {
          //TODO not reflected in db yet
        }
      }

      for (const removedField of fields.removed) {
        queries.push({
          alterTable: mergedTable.current.name,
          drop: {
            column: removedField.name
          }
        });
      }

      const references = merge(mergedTable.current.references, mergedTable.target.references, (first, second) => first.name === second.name);
      for (const addedReference of references.added) {
        queries.push({
          alterTable: mergedTable.current.name,
          add: {
            constraint: addedReference.name,
            foreignKey: addedReference.keys.map(k => k.field.name),
            references: {
              table: addedReference.table.name,
              primaryKeys: addedReference.keys.map(k => k.foreignField.name)
            }
          }
        });
      }

      for (const removedReference of references.removed) {
        throw new Error("removing references is not supported yet");
      }
    }

    for (const addedTable of tables.added) {
      for (const reference of addedTable.references) {
        queries.push({
          alterTable: addedTable.name,
          add: {
            constraint: reference.name,
            foreignKey: reference.keys.map(k => k.field.name),
            references: {
              table: reference.table.name,
              primaryKeys: reference.keys.map(k => k.foreignField.name)
            }
          }
        });
      }
    }

    for (const removedTable of tables.removed) {
      queries.push({
        dropTable: removedTable.name
      });
    }

    return queries;
  }

  async apply(
    current: RelationalSchemaDescription,
    target: RelationalSchemaDescription,
    targetId: string,
    dataAdapter: RelationalTransactionAdapter
  ) {
    const sqls = this.plan(current, target);

    await dataAdapter.transaction(async client => {
      await client.exec( {lockTable: { schema: "daita", table: "migrations" } }); //TODO sqlite support?
      await client.exec({ insert: { schema: "daita", table: "migrations" }, values: [{ id: targetId }] });

      for (const sql of sqls) {
        await client.exec(sql);
      }
    });
  }
}
