// import {SqlSelect} from '../sql/sql-select';
// import {SqlExpression} from '../sql/sql-expression';
// import {SqlCompareExpression} from '../sql/sql-compare-expression';
// import {SqlInExpression} from '../sql/sql-in-expression';
// import {MigrationSchema} from '../schema/migration-schema';
// import {MigrationSchemaTable} from '../schema/migration-schema-table';
//
// export abstract class RelationalBaseAdapter {
//
//   protected buildMapper(key: string) {
//     const [alias, fieldName] = key.split('.');
//     if (alias === 'base') {
//       return {set: (row: any, val: any) => (row[fieldName] = val)};
//     } else {
//       const aliasPath = alias.substr('base_'.length).split('_');
//       return {
//         set: (row: any, val: any) => {
//           let current = row;
//           if (val !== null && val !== undefined) {
//             for (const path of aliasPath) {
//               if (!current[path]) {
//                 current[path] = {};
//               }
//               current = current[path];
//             }
//             current[fieldName] = val;
//           }
//         },
//       };
//     }
//   }
//
//   protected mapResults(rows: any[]) {
//     const mappedRows: any[] = [];
//     const fieldMapping: {
//       [key: string]: { set: (row: any, val: any) => void };
//     } = {};
//     for (const row of rows) {
//       const mappedRow: any = {};
//       for (const key of Object.keys(row)) {
//         if (!fieldMapping[key]) {
//           fieldMapping[key] = this.buildMapper(key);
//         }
//         fieldMapping[key].set(mappedRow, row[key]);
//       }
//       mappedRows.push(mappedRow);
//     }
//
//     return mappedRows;
//   }
//
//   private mapSourceTable(table: MigrationSchemaTable) {
//     return `${table.name}_${table.sourceMigration.id}`;
//   }
//
//   private getSourceField(table: MigrationSchemaTable, fieldName: string) {
//     const field = table.field(fieldName);
//     if (!field) {
//       throw new Error(
//         `Could not find field ${fieldName} in table ${table.name}`,
//       );
//     }
//     return field.baseFieldName;
//   }
//
//   private getSchemaTable(schema: MigrationSchema, tableName: string) {
//     const table = schema.table(tableName);
//     if (!table) {
//       throw new Error(`Could not find table ${tableName}`);
//     }
//     return table;
//   }
//
//
//   private addTableFields(select: SqlSelect, table: MigrationSchemaTable, tableAlias: string) {
//     for (const field of table.fields) {
//       select.select.push({
//         table: tableAlias,
//         field: field.baseFieldName,
//         alias: `${tableAlias}.${field.name}`,
//       });
//     }
//   }
//
//
//   private parseInlineFilter(schema: MigrationSchema, table: MigrationSchemaTable, filter: any): SqlExpression {
//     return this.parseFilter(schema, table, filter, [], (tbl, prop, path, operand, value) => {
//       if (tbl !== table) {
//         throw new Error('not supported yet');
//       }
//
//       if (operand === 'in' || operand === 'not in') {
//         return {
//           left: {field: this.getSourceField(table, prop)},
//           operand,
//           value,
//         } as SqlInExpression;
//       }
//       return {
//         left: {field: this.getSourceField(table, prop)},
//         operand,
//         right: value,
//       } as SqlCompareExpression;
//     });
//   }
//
//   private parseJoinFilter(schema: MigrationSchema, table: MigrationSchemaTable, filter: any, select: SqlSelect): SqlExpression {
//     return this.parseFilter(schema, table, filter, ['base'], (tbl, prop, path, operand, value) => {
//       const tableAlias = path.join('_');
//       const includePath = [...path];
//       includePath.splice(0, 1);
//       this.addInclude(select, schema, table, 'base', includePath, false);
//
//       if (operand === 'in' || operand === 'not in') {
//         return {
//           left: {table: tableAlias, field: this.getSourceField(tbl, prop)},
//           operand,
//           value,
//         } as SqlInExpression;
//       }
//       return {
//         left: {table: tableAlias, field: this.getSourceField(tbl, prop)},
//         operand,
//         right: value,
//       } as SqlCompareExpression;
//     });
//   }
//
// }