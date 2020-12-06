import { Client } from '../../relational/client/client';
import { InsertSql } from '../../relational/sql/dml/insert/insert-sql';
import { CreateTableForeignKey, CreateTableSql } from '../../relational/sql/ddl/create-table/create-table-sql';
import { DropTableSql } from '../../relational/sql/ddl/drop-table/drop-table-sql';
import { field, table } from '../../relational';
import { SchemaDescription } from '../../orm/schema/description/relational-schema-description';
import { RelationalTableFieldDescription } from '../../orm/schema/description/relational-table-field-description';
import { RelationalTableReferenceDescription } from '../../orm/schema/description/relational-table-reference-description';

export async function migrateTableAction(
  client: Client<InsertSql<any> | CreateTableSql | DropTableSql>,
  tableName: string,
  schema: string | undefined,
  filterFields: (field: RelationalTableFieldDescription) => boolean,
  referenceFilter: (field: RelationalTableReferenceDescription) => boolean,
  targetSchema: SchemaDescription,
) {
  const tbl = table(tableName, schema);
  const tmpTbl = table(tableName + '_tmp', schema);
  const tableDescription = targetSchema.table(tbl);
  const newFields = tableDescription.fields.filter(filterFields);
  const newReferences = tableDescription.references.filter(referenceFilter);

  const selectFields = newFields.reduce<any>((fields, fld) => {
    fields[fld.name] = field(tbl, fld.name);
    return fields;
  }, {});
  const copyFields = newFields.reduce<any>((fields, fld) => {
    fields[fld.name] = field(tmpTbl, fld.name);
    return fields;
  }, {});
  const foreignKey = newReferences.reduce<{ [key: string]: CreateTableForeignKey }>((refs, ref) => {
    refs[ref.name] = {
      key: ref.keys.map((k) => k.field.name),
      references: {
        primaryKey: ref.keys.map((k) => k.foreignField.name),
        table: table(ref.table.name, ref.table.schema),
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
