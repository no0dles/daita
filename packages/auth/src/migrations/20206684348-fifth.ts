import { MigrationDescription } from "@daita/orm";

export const FifthMigration: MigrationDescription = {
    id: "fifth",
    after: "fourth",
    steps: [
        { kind: "add_table_field", table: "UserPool", fieldName: "allowRegistration", type: "boolean", required: false, defaultValue: null }
    ]
};