import { MigrationDescription } from "@daita/core";

export const InitialMigration: MigrationDescription = {
    id: "initial",
    steps: [
        { kind: "add_table", table: "User" },
        { kind: "add_table_field", table: "User", fieldName: "username", type: "string", required: true, defaultValue: null },
        { kind: "add_table_field", table: "User", fieldName: "firstName", type: "string", required: true, defaultValue: null },
        { kind: "add_table_field", table: "User", fieldName: "lastName", type: "string", required: true, defaultValue: null },
        { kind: "add_table_field", table: "User", fieldName: "password", type: "string", required: true, defaultValue: null },
        { kind: "add_table_field", table: "User", fieldName: "email", type: "string", required: true, defaultValue: null },
        { kind: "add_table_primary_key", table: "User", fieldNames: ["username"] },
        { kind: "add_table", table: "UserRole" },
        { kind: "add_table_field", table: "UserRole", fieldName: "userUsername", type: "string", required: true, defaultValue: null },
        { kind: "add_table_field", table: "UserRole", fieldName: "roleName", type: "string", required: true, defaultValue: null },
        { kind: "add_table_primary_key", table: "UserRole", fieldNames: ["userUsername", "roleName"] },
        { kind: "add_table_foreign_key", table: "UserRole", name: "user", foreignTable: "User", fieldNames: ["userUsername"], foreignFieldNames: ["username"], required: true },
        { kind: "add_table_foreign_key", table: "UserRole", name: "role", foreignTable: "Role", fieldNames: ["roleName"], foreignFieldNames: ["name"], required: true },
        { kind: "add_table", table: "UserPermission" },
        { kind: "add_table_field", table: "UserPermission", fieldName: "permissionName", type: "string", required: true, defaultValue: null },
        { kind: "add_table_field", table: "UserPermission", fieldName: "userUsername", type: "string", required: true, defaultValue: null },
        { kind: "add_table_primary_key", table: "UserPermission", fieldNames: ["userUsername", "permissionName"] },
        { kind: "add_table_foreign_key", table: "UserPermission", name: "permission", foreignTable: "Permission", fieldNames: ["permissionName"], foreignFieldNames: ["name"], required: true },
        { kind: "add_table_foreign_key", table: "UserPermission", name: "user", foreignTable: "User", fieldNames: ["userUsername"], foreignFieldNames: ["username"], required: true },
        { kind: "add_table", table: "Role" },
        { kind: "add_table_field", table: "Role", fieldName: "name", type: "string", required: true, defaultValue: null },
        { kind: "add_table_primary_key", table: "Role", fieldNames: ["name"] },
        { kind: "add_table", table: "RolePermission" },
        { kind: "add_table_field", table: "RolePermission", fieldName: "permissionName", type: "string", required: true, defaultValue: null },
        { kind: "add_table_field", table: "RolePermission", fieldName: "roleName", type: "string", required: true, defaultValue: null },
        { kind: "add_table_primary_key", table: "RolePermission", fieldNames: ["roleName", "permissionName"] },
        { kind: "add_table_foreign_key", table: "RolePermission", name: "permission", foreignTable: "Permission", fieldNames: ["permissionName"], foreignFieldNames: ["name"], required: true },
        { kind: "add_table_foreign_key", table: "RolePermission", name: "role", foreignTable: "Role", fieldNames: ["roleName"], foreignFieldNames: ["name"], required: true },
        { kind: "add_table", table: "Permission" },
        { kind: "add_table_field", table: "Permission", fieldName: "name", type: "string", required: true, defaultValue: null },
        { kind: "add_table_primary_key", table: "Permission", fieldNames: ["name"] }
    ]
};