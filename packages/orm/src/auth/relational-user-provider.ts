// import {UserProvider} from './user-provider';
// import {RelationalMigrationAdapter} from '@daita/core/dist/adapter/relational-migration-adapter';
// import { RelationalDataContext } from "../context";
// import { AuthorizedContextUser } from "./index";
// import { RelationalSchema } from "../schema";
//
// export class RelationalUserProvider implements UserProvider {
//   private context: RelationalDataContext;
//   private migrated = false;
//
//   constructor(private dataAdapter: RelationalMigrationAdapter) {
//     this.context = schema.context(dataAdapter);
//   }
//
//   async addRole(name: string) {
//     await this.context.insert(Role).value({
//       name,
//     });
//   }
//
//   async addUserRole(userId: string, roleName: string) {
//     const index = userId.lastIndexOf(':');
//     const issuer = userId.substr(0, index);
//     const subject = userId.substr(index + 1);
//     await this.context.insert(UserRole)
//       .value({
//         roleName,
//         userIssuer: issuer,
//         userSubject: subject,
//       });
//   }
//
//   async get(token: AccessToken): Promise<AuthorizedContextUser> {
//     const roles: string[] = [];
//
//     if (!this.migrated) {
//       try {
//         const migrationContext = schema.migrationContext(this.dataAdapter);
//         await migrationContext.apply();
//         this.migrated = true;
//       } catch (e) {
//         console.log('migration failed', e);
//         throw e;
//       }
//     }
//
//     let user = await this.context
//       .select(User)
//       .where({
//         issuer: token.iss,
//         subject: token.sub,
//       })
//       .first();
//
//     if (!user) {
//       user = new User();
//       user.subject = token.sub;
//       user.issuer = token.iss;
//       user.email = (<any>token).email;
//       user.firstName = (<any>token).given_name;
//       user.lastName = (<any>token).family_name;
//       await this.context.insert(User).value(user);
//     } else {
//       const userRoles = await this.context
//         .select(UserRole)
//         .where({
//           user: {
//             issuer: token.iss,
//             subject: token.sub,
//           },
//         });
//       roles.push(...userRoles.map(ur => ur.roleName));
//     }
//
//     return {
//       roles,
//       permissions: [],
//       anonymous: false,
//       id: `${user.issuer}:${user.subject}`,
//       username: null,
//     };
//   }
// }
//
// class User {
//   subject!: string;
//   issuer!: string;
//   email?: string;
//   firstName?: string;
//   lastName?: string;
// }
//
// class UserRole {
//   user!: User;
//   userSubject!: string;
//   userIssuer!: string;
//   role!: Role;
//   roleName!: string;
// }
//
// class Role {
//   name!: string;
// }
//
// const schema = new RelationalSchema({schema: 'auth'});
// schema.table(User, {key: ['subject', 'issuer']});
// schema.table(Role, {key: ['name']});
// schema.table(UserRole, {key: ['userSubject', 'userIssuer', 'roleName']});
//
// // const permissions = new PermissionBuilder();
// // permissions.push(User, {role: 'provider', select: true, type: 'role'});
// // permissions.push(Role, {role: 'provider', select: true, type: 'role'});
// // permissions.push(UserRole, {role: 'provider', select: true, type: 'role'});
//
// schema.migration({
//   id: 'first-auth',
//   steps: [
//     {kind: 'add_table', table: 'User'},
//     {kind: 'add_table', table: 'Role'},
//     {kind: 'add_table', table: 'UserRole'},
//     {kind: 'add_table_field', table: 'User', type: 'string', fieldName: 'subject', required: true},
//     {kind: 'add_table_field', table: 'User', type: 'string', fieldName: 'issuer', required: true},
//     {kind: 'add_table_field', table: 'User', type: 'string', fieldName: 'email', required: false},
//     {kind: 'add_table_field', table: 'User', type: 'string', fieldName: 'firstName', required: false},
//     {kind: 'add_table_field', table: 'User', type: 'string', fieldName: 'lastName', required: false},
//     {kind: 'add_table_field', table: 'Role', type: 'string', fieldName: 'name', required: true},
//     {kind: 'add_table_field', table: 'UserRole', type: 'string', fieldName: 'userSubject', required: true},
//     {kind: 'add_table_field', table: 'UserRole', type: 'string', fieldName: 'userIssuer', required: true},
//     {kind: 'add_table_field', table: 'UserRole', type: 'string', fieldName: 'roleName', required: true},
//     {kind: 'add_table_primary_key', table: 'User', fieldNames: ['subject', 'issuer']},
//     {kind: 'add_table_primary_key', table: 'Role', fieldNames: ['name']},
//     {kind: 'add_table_primary_key', table: 'UserRole', fieldNames: ['userSubject', 'userIssuer', 'roleName']},
//     {
//       kind: 'add_table_foreign_key',
//       table: 'UserRole',
//       fieldNames: ['userSubject', 'userIssuer'],
//       required: true,
//       name: 'user',
//       foreignTable: 'User',
//       foreignFieldNames: ['subject', 'issuer'],
//     },
//     {
//       kind: 'add_table_foreign_key',
//       table: 'UserRole',
//       fieldNames: ['roleName'],
//       required: true,
//       name: 'role',
//       foreignTable: 'Role',
//       foreignFieldNames: ['name'],
//     },
//     {kind: 'add_table_permission', table: 'User', permission: {role: 'provider', select: true}},
//     {kind: 'add_table_permission', table: 'Role', permission: {role: 'provider', select: true}},
//     {kind: 'add_table_permission', table: 'UserRole', permission: {role: 'provider', select: true}},
//   ],
// });
//
// // schema.permission(permissions);
