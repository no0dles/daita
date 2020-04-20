// import {MigrationSchema} from './migration-schema';
// import {MigrationSchemaTable} from './migration-schema-table';
// import {MigrationDescription} from '../migration';
// import {MigrationSchemaTableField} from './migration-schema-table-field';
// import { TablePermission } from "@daita/core";
//
// export function getMigrationSchema(migrationPath: MigrationDescription[]) {
//   const tableMap: { [key: string]: MigrationSchemaTable } = {};
//   const permissionMap: { [key: string]: TablePermission<any>[] } = {};
//
//   for (const migration of migrationPath) {
//     for (const step of migration.steps) {
//       if (step.kind === 'add_table') {
//         tableMap[step.table] = new MigrationSchemaTable(step.table, migration);
//       } else if (step.kind === 'add_table_field') {
//         tableMap[step.table].add(
//           new MigrationSchemaTableField(
//             step.fieldName,
//             step.type,
//             step.required || false,
//             step.defaultValue,
//             migration,
//             step.fieldName,
//           ),
//         );
//       } else if (step.kind === 'drop_table') {
//         delete tableMap[step.table];
//       } else if (step.kind === 'add_table_primary_key') {
//         tableMap[step.table].primaryKeys.push(...step.fieldNames);
//       } else if (step.kind === 'add_table_foreign_key') {
//         tableMap[step.table].foreignKeys.push({
//           name: step.name,
//           table: step.foreignTable,
//           keys: step.fieldNames,
//           foreignKeys: step.foreignFieldNames,
//           required: step.required,
//         });
//       } else if (step.kind === 'add_table_permission') {
//         if (!permissionMap[step.table]) {
//           permissionMap[step.table] = [];
//         }
//         permissionMap[step.table].push(step.permission);
//       } else if (step.kind === 'drop_table_permission') {
//         const permissions = permissionMap[step.table];
//         for (let i = 0; permissions.length; i++) {
//           if (JSON.stringify(permissions[i]) === JSON.stringify(step.permission)) {
//             permissions.splice(i, 1);
//             break;
//           }
//         }
//       } else if (step.kind === 'drop_table_field') {
//         tableMap[step.table].drop(step.fieldName);
//       } else {
//         fail(step, `Unknown migration step ${step}`);
//       }
//     }
//   }
//
//   const migrationId =
//     migrationPath.length > 0
//       ? migrationPath[migrationPath.length - 1].id
//       : null;
//   return new MigrationSchema(migrationId, tableMap, permissionMap);
// }
//
// function fail(value: never, message: string): never {
//   throw new Error(message);
// }
