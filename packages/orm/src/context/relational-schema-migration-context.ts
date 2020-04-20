import {MigrationExecution, MigrationTree} from '../migration';
import { RelationalMigrationAdapter } from "@daita/core";

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
        const migrationSchema = this.migrationTree.defaultBackwardDescription(currentMigration.id);
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
