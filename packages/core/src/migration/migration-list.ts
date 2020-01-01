// import {MigrationSchema} from '../schema/migration-schema';
// import {getMigrationSchema} from '../schema/migration-schema-builder';
// import {Migration} from './migration';
//
// export class MigrationList {
//   private migrationMap: { [key: string]: Migration } = {};
//   private migrationAfterMap: { [key: string]: Migration[] } = {};
//
//   constructor(private migrations: Migration[] = []) {
//     for (const migration of migrations) {
//       this.addMigration(migration);
//     }
//   }
//
//   get migrationNames() {
//     return Object.keys(this.migrationMap);
//   }
//
//   getMigrationCount() {
//     return Object.keys(this.migrationMap).length;
//   }
//
//   addMigration(migration: Migration) {
//     if (this.migrationMap[migration.id]) {
//       throw new Error(`migration id ${migration.id} is used twice`);
//     }
//     this.migrationMap[migration.id] = migration;
//
//     if (migration.after) {
//       if (!this.migrationAfterMap[migration.after.id]) {
//         this.migrationAfterMap[migration.after.id] = [];
//       }
//       this.migrationAfterMap[migration.after.id].push(migration);
//     }
//     if(migration.resolve) {
//       if (!this.migrationAfterMap[migration.resolve.id]) {
//         this.migrationAfterMap[migration.resolve.id] = [];
//       }
//       this.migrationAfterMap[migration.resolve.id].push(migration);
//     }
//   }
//
//   getLastMigrations(): Migration[] {
//     const migrations: Migration[] = [];
//     const migrationIds = Object.keys(this.migrationMap);
//     for (const migrationId of migrationIds) {
//       if(this.migrationAfterMap[migrationId]) {
//         continue;
//       }
//
//       migrations.push(this.migrationMap[migrationId]);
//     }
//     return migrations;
//   }
//
//   getMigration(id: string): Migration {
//     return this.migrationMap[id] || null;
//   }
//
//   getMigrationPath(id: string): Migration[] {
//     const targetMigration = this.getMigration(id);
//     const migrations: Migration[] = [targetMigration];
//     let current = targetMigration.after;
//     while (current !== null) {
//       migrations.unshift(current);
//       current = current.after;
//     }
//     return migrations;
//   }
//
//   getSchema(id: string): MigrationSchema {
//     const path = this.getMigrationPath(id);
//     return getMigrationSchema(path);
//   }
//
//   getRoots(): Migration[] {
//     const migrationIds = Object.keys(this.migrationMap);
//     const roots: Migration[] = [];
//     for(const migrationId of migrationIds) {
//       if(!this.migrationMap[migrationId].after) {
//         roots.push(this.migrationMap[migrationId]);
//       }
//     }
//     return roots;
//   }
//
//   getNext(id: string): Migration[] {
//     return this.migrationAfterMap[id] || [];
//   }
// }
