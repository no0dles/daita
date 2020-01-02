import { RelationalAddTableMigrationStep, RelationalAddTableFieldMigrationStep, RelationalAddTablePrimaryKey } from "@daita/core";

export class InitialMigration {
    id = "initial";
    steps = [
        new RelationalAddTableMigrationStep("Todo"),
        new RelationalAddTableFieldMigrationStep("Todo", "id", "string", true, null),
        new RelationalAddTableFieldMigrationStep("Todo", "name", "string", true, null),
        new RelationalAddTableFieldMigrationStep("Todo", "done", "boolean", true, null),
        new RelationalAddTablePrimaryKey("Todo", ["id"])
    ];
}