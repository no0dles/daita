import { MigrationDescription } from "@daita/orm";

export const InitMigration: MigrationDescription = {
    id: "init",
    steps: [
        { kind: "add_table", table: "User" },
        { kind: "add_table_field", table: "User", fieldName: "username", type: "string", required: true, defaultValue: null },
        { kind: "add_table_field", table: "User", fieldName: "firstName", type: "string", required: false, defaultValue: null },
        { kind: "add_table_field", table: "User", fieldName: "lastName", type: "string", required: false, defaultValue: null },
        { kind: "add_table_field", table: "User", fieldName: "password", type: "string", required: true, defaultValue: null },
        { kind: "add_table_field", table: "User", fieldName: "email", type: "string", required: true, defaultValue: null },
        { kind: "add_table_primary_key", table: "User", fieldNames: ["username"] },
        { kind: "add_table", table: "UserRole" },
        { kind: "add_table_field", table: "UserRole", fieldName: "roleName", type: "string", required: true, defaultValue: null },
        { kind: "add_table_field", table: "UserRole", fieldName: "userUsername", type: "string", required: true, defaultValue: null },
        { kind: "add_table_primary_key", table: "UserRole", fieldNames: ["roleName", "userUsername"] },
        { kind: "add_table", table: "Role" },
        { kind: "add_table_field", table: "Role", fieldName: "name", type: "string", required: true, defaultValue: null },
        { kind: "add_table_primary_key", table: "Role", fieldNames: ["name"] },
        { kind: "add_table_foreign_key", table: "UserRole", name: "role", foreignTable: "Role", fieldNames: ["roleName"], foreignFieldNames: ["name"], required: true },
        { kind: "add_table_foreign_key", table: "UserRole", name: "user", foreignTable: "User", fieldNames: ["userUsername"], foreignFieldNames: ["username"], required: true },
        { kind: "add_table", table: "Permission" },
        { kind: "add_table_field", table: "Permission", fieldName: "name", type: "string", required: true, defaultValue: null },
        { kind: "add_table_primary_key", table: "Permission", fieldNames: ["name"] },
        { kind: "add_table", table: "RolePermission" },
        { kind: "add_table_field", table: "RolePermission", fieldName: "roleName", type: "string", required: true, defaultValue: null },
        { kind: "add_table_field", table: "RolePermission", fieldName: "permissionName", type: "string", required: true, defaultValue: null },
        { kind: "add_table_primary_key", table: "RolePermission", fieldNames: ["permissionName", "roleName"] },
        { kind: "add_table_foreign_key", table: "RolePermission", name: "role", foreignTable: "Role", fieldNames: ["roleName"], foreignFieldNames: ["name"], required: true },
        { kind: "add_table_foreign_key", table: "RolePermission", name: "permission", foreignTable: "Permission", fieldNames: ["permissionName"], foreignFieldNames: ["name"], required: true }
    ]
};
