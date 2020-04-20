import { mergeList, RelationalMigrationAdapter } from "@daita/core";
import { SqlDmlQuery } from "@daita/core";
import { RelationalSchemaDescription } from "../schema/description/relational-schema-description";

export class MigrationExecution {
  async init(dataAdapter: RelationalMigrationAdapter) {
    await dataAdapter.raw(
      `CREATE SCHEMA IF NOT EXISTS "daita";`,
      []
    );
    await dataAdapter.raw({
      createTable: { schema: "daita", table: "migrations" },
      ifNotExist: true,
      fields: [
        { name: "id", type: "string", notNull: true, primaryKey: true }
      ]
    });
  }

  async exists(id: string, dataAdapter: RelationalMigrationAdapter) {
    const result = await dataAdapter.raw({
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
  ): SqlDmlQuery[] {
    const queries: SqlDmlQuery[] = [];

    const tables = mergeList(current.tables, target.tables, (first, second) => first.key === second.key);
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
      const primaryKeys = mergeList(mergedTable.current.primaryKeys, mergedTable.target.primaryKeys, (first, second) => first === second);
      for (const addedPrimaryKey of primaryKeys.added) {
        throw new Error("cant add primary key after creation of table");
      }
      for (const addedPrimaryKey of primaryKeys.removed) {
        throw new Error("cant drop primary key after creation of table");
      }

      const fields = mergeList(mergedTable.current.fields, mergedTable.target.fields, (first, second) => first.key === second.key);

      for (const addedField of fields.added) {
        queries.push({
          alterTable: mergedTable.current.name,
          add: {
            column: addedField.name,
            type: addedField.type
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

      const references = mergeList(mergedTable.current.references, mergedTable.target.references, (first, second) => first.name === second.name);
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
    dataAdapter: RelationalMigrationAdapter
  ) {
    const sqls = this.plan(current, target);

    await dataAdapter.transaction(async client => {
      await client.raw(`LOCK TABLE "daita"."migrations"`, []); //TODO sqlite support?
      await client.raw({ insert: { schema: "daita", table: "migrations" }, values: [{ id: migration.id }] });

      for (const sql of sqls) {
        await client.raw(sql);
      }
    });
  }
}
