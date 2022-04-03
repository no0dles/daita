export interface Migration<TSql> {
  id: string;
  after?: string;
  resolve?: string;
  upMigration: TSql[];
  downMigration: TSql[];
}

export class MigrationTree<TSql> {
  private migrationMap: { [id: string]: Migration<TSql> } = {};
  private afterMigrations: { [id: string]: Migration<TSql>[] } = {};
  private rootMigrations: {
    [id: string]: {
      root: Migration<TSql>;
      next: Migration<TSql> | null;
      last: Migration<TSql> | null;
    };
  } = {};

  migrationCount = 0;

  constructor(public name: string, migrations: Migration<TSql>[] = []) {
    for (const migration of migrations) {
      this.add(migration);
    }
  }

  add(migration: Migration<TSql>) {
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
    return Object.keys(this.migrationMap).map((id) => this.migrationMap[id]);
  }

  roots() {
    return Object.keys(this.rootMigrations).map((id) => this.migrationMap[id]);
  }

  last(): Migration<TSql>[] {
    const migrations: Migration<TSql>[] = [];
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

  defaultPath(id?: string) {
    if (id) {
      return this.path(id);
    }

    const lastMigrations = this.last();
    if (lastMigrations.length === 1) {
      return this.path(lastMigrations[0].id);
    } else if (lastMigrations.length === 0) {
      return [];
    } else {
      throw new Error('more than 1 migration');
    }
  }

  path(id: string) {
    const targetMigration = this.migrationMap[id];
    const migrations: Migration<TSql>[] = [targetMigration];
    let current = targetMigration.after ? this.migrationMap[targetMigration.after] : null;
    while (current !== null) {
      migrations.unshift(current);
      current = current.after ? this.migrationMap[current.after] : null;
    }
    return migrations;
  }
}

export const isMigrationTree = (val: any): val is MigrationTree<any> => typeof val.path === 'function';
