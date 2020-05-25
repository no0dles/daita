import { MigrationDescription, MigrationExecution, MigrationTree } from "../migration";
import { RelationalTransactionAdapter } from "@daita/relational";
import { getSchemaDescription } from "../schema/relational-schema-description";
import { SchemaMapper } from "../schema/description/schema-mapper";
import { BackwardCompatibleMapper } from "../schema/description/backward-compatible-mapper";

export class RelationalSchemaMigrationContext {
  constructor(private relationalTransactionAdapter: RelationalTransactionAdapter,
              private migrationTree: MigrationTree) {
  }

  plan() {

  }

  async apply() {
    await this.migrationTree.applyMigrations(this.relationalTransactionAdapter);
  }
}
