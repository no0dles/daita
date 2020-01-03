import { MigrationDescription } from './migration-description';
import { getMigrationSchema } from '../schema/migration-schema-builder';

export class MigrationTree {
  private migrationMap: { [id: string]: MigrationDescription } = {};
  private afterMigrations: { [id: string]: MigrationDescription[] } = {};
  private rootMigrations: {
    [id: string]: {
      root: MigrationDescription;
      next: MigrationDescription | null;
      last: MigrationDescription | null;
    };
  } = {};

  migrationCount = 0;

  constructor(migrations: MigrationDescription[] = []) {
    for (const migration of migrations) {
      this.add(migration);
    }
  }

  add(migration: MigrationDescription) {
    if (this.migrationMap[migration.id]) {
      throw new Error(`migration with id ${migration.id} already exists`);
    }

    this.migrationMap[migration.id] = migration;
    this.migrationCount++;
    if (migration.after) {
      if (!this.afterMigrations[migration.after]) {
        this.afterMigrations[migration.after] = [];
      }
      this.afterMigrations[migration.after].push(migration);

      if (migration.resolve) {
        if (!this.afterMigrations[migration.resolve]) {
          this.afterMigrations[migration.resolve] = [];
        }
        this.afterMigrations[migration.resolve].push(migration);
      }
    } else {
      this.rootMigrations[migration.id] = {
        root: migration,
        next: null,
        last: migration,
      };
    }
  }

  migrations() {
    return Object.keys(this.migrationMap).map(id => this.migrationMap[id]);
  }

  roots() {
    return Object.keys(this.rootMigrations).map(id => this.migrationMap[id]);
  }

  last() {
    const migrations: MigrationDescription[] = [];
    const migrationIds = Object.keys(this.migrationMap);
    for (const migrationId of migrationIds) {
      if (this.afterMigrations[migrationId]) {
        continue;
      }

      migrations.push(this.migrationMap[migrationId]);
    }
    return migrations;
  }

  next(id: string) {
    return this.afterMigrations[id] || [];
  }

  get(id: string) {
    return this.migrationMap[id] || null;
  }

  schema(id: string) {
    return getMigrationSchema(this.path(id));
  }

  path(id: string) {
    const targetMigration = this.migrationMap[id];
    const migrations: MigrationDescription[] = [targetMigration];
    let current = targetMigration.after
      ? this.migrationMap[targetMigration.after]
      : null;
    while (current !== null) {
      migrations.unshift(current);
      current = current.after ? this.migrationMap[current.after] : null;
    }
    return migrations;
  }
}
