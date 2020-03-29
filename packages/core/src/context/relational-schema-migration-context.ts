import {RelationalMigrationAdapter} from '../adapter/relational-migration-adapter';
import {getMigrationSchema} from '../schema/migration-schema-builder';
import {MigrationExecution, MigrationTree} from '../migration';

export class RelationalSchemaMigrationContext  {
  constructor(private relationalMigrationAdapter: RelationalMigrationAdapter,
              private migrationTree: MigrationTree) {
  }

  plan() {

  }

  async apply() {
    const exec = new MigrationExecution();

    //TODO warn if things are not migrated

    await exec.init(this.relationalMigrationAdapter);

    let currentMigrations = this.migrationTree.roots();
    while (currentMigrations.length > 0) {
      if (currentMigrations.length > 1) {
        throw new Error('multiple possible next migrations');
      }

      const currentMigration = currentMigrations[0];
      if (!(await exec.exists(currentMigration.id, this.relationalMigrationAdapter))) {
        const migrationPath = this.migrationTree.path(currentMigration.id);
        const migrationSchema = getMigrationSchema(migrationPath);
        await exec.apply(
          currentMigration,
          migrationSchema,
          this.relationalMigrationAdapter,
        );
      }

      currentMigrations = this.migrationTree.next(currentMigration.id);
    }
  }
}