import {MigrationDescription} from '../../orm/migration';

export const ThirdMigration: MigrationDescription = {
    id: "third",
    after: "second",
    steps: [
        { kind: "add_table_field", table: "UserPool", fieldName: "emailVerifyExpiresIn", type: "number", required: true, defaultValue: null },
        { kind: "add_table_field", table: "UserEmailVerify", fieldName: "verifiedAt", type: "date", required: false, defaultValue: null }
    ]
};
