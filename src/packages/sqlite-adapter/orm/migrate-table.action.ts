import { Client } from '../../relational/client/client';
import { InsertSql } from '../../relational/sql/dml/insert/insert-sql';
import { CreateTableForeignKey, CreateTableSql } from '../../relational/sql/ddl/create-table/create-table-sql';
import { DropTableSql } from '../../relational/sql/ddl/drop-table/drop-table-sql';
import { field, table } from '../../relational';
import {
  getFieldNamesFromSchemaTable,
  getFieldsFromSchemaTable,
  getReferencesFromSchemaTable,
  getTableFromSchema,
  SchemaDescription,
  SchemaTableFieldDescription,
  SchemaTableReferenceDescription,
} from '../../orm/schema/description/relational-schema-description';

export async function migrateTableAction(
  client: Client<InsertSql<any> | CreateTableSql | DropTableSql>,
  tableName: string,
  schema: string | undefined,
  filterFields: (field: SchemaTableFieldDescription) => boolean,
  referenceFilter: (field: SchemaTableReferenceDescription) => boolean,
  targetSchema: SchemaDescription,
) {
  const tbl = table(tableName, schema);
  const tmpTbl = table(tableName + '_tmp', schema);

  const tableDescription = getTableFromSchema(targetSchema, tbl);
  const newFields = getFieldsFromSchemaTable(tableDescription.table)
    .map((f) => f.field)
    .filter(filterFields);
  const newReferences = getReferencesFromSchemaTable(tableDescription.table).filter(referenceFilter);

  const selectFields = newFields.reduce<any>((fields, fld) => {
    fields[fld.name] = field(tbl, fld.name);
    return fields;
  }, {});
  const copyFields = newFields.reduce<any>((fields, fld) => {
    fields[fld.name] = field(tmpTbl, fld.name);
    return fields;
  }, {});
  const foreignKey = newReferences.reduce<{ [key: string]: CreateTableForeignKey }>((refs, ref) => {
    const refTable = getTableFromSchema(targetSchema, table(ref.table, ref.schema));
    refs[ref.name] = {
      key: getFieldNamesFromSchemaTable(
        tableDescription.table,
        ref.keys.map((k) => k.field),
      ),
      references: {
        primaryKey: getFieldNamesFromSchemaTable(
          refTable.table,
          ref.keys.map((k) => k.foreignField),
        ),
        table: table(refTable.table.name, refTable.table.schema),
      },
    };
    return refs;
  }, {});
  await client.exec({
    createTable: tmpTbl,
    columns: newFields,
    foreignKey,
  });
  await client.exec({
    into: tmpTbl,
    insert: {
      select: selectFields,
      from: tbl,
    },
  });
  await client.exec({
    dropTable: tbl,
  });
  await client.exec({
    createTable: tbl,
    columns: newFields,
  });
  await client.exec({
    into: tbl,
    insert: {
      select: copyFields,
      from: tmpTbl,
    },
  });
  await client.exec({
    dropTable: tmpTbl,
  });
}
