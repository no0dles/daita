import { MigrationDescription, MigrationExecution, MigrationTree } from "../migration";
import { RelationalMigrationAdapter } from "@daita/relational";
import { getSchemaDescription } from "../schema/relational-schema-description";
import { SchemaMapper } from "../schema/description/schema-mapper";
import { BackwardCompatibleMapper } from "../schema/description/backward-compatible-mapper";

export class RelationalSchemaMigrationContext {
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

    const migrationDescriptions: MigrationDescription[] = [];
    let currentSchema = this.getSchema(migrationDescriptions);

    while (currentMigrations.length > 0) {
      if (currentMigrations.length > 1) {
        throw new Error("multiple possible next migrations");
      }

      const currentMigration = currentMigrations[0];

      migrationDescriptions.push(currentMigration);
      const targetSchema = this.getSchema(migrationDescriptions);
      if (!(await exec.exists(currentMigration.id, this.relationalMigrationAdapter))) {
        await exec.apply(
          currentSchema,
          targetSchema,
          currentMigration.id,
          this.relationalMigrationAdapter
        );
      }

      currentSchema = targetSchema;
      currentMigrations = this.migrationTree.next(currentMigration.id);
    }
  }

  getSchema(paths: MigrationDescription[]) {
    return getSchemaDescription(new SchemaMapper(() => new BackwardCompatibleMapper()), paths);
  }
}
