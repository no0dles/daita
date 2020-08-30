import {MigrationDescription} from '../../orm/migration';

export const SecondMigration: MigrationDescription = {
    id: "second",
    after: "init",
    steps: [
        { kind: "add_table", table: "UserRole" },
        { kind: "add_table_field", table: "UserRole", fieldName: "userUsername", type: "string", required: true, defaultValue: null },
        { kind: "add_table_field", table: "UserRole", fieldName: "roleName", type: "string", required: true, defaultValue: null },
        { kind: "add_table_primary_key", table: "UserRole", fieldNames: ["userUsername", "roleName"] },
        { kind: "add_table_foreign_key", table: "UserRole", name: "user", foreignTable: "User", fieldNames: ["userUsername"], foreignFieldNames: ["username"], required: true },
        { kind: "add_table_foreign_key", table: "UserRole", name: "role", foreignTable: "Role", fieldNames: ["roleName"], foreignFieldNames: ["name"], required: true }
    ]
};
