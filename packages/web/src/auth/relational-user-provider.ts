import {UserProvider} from './user-provider';
import {AccessToken} from './token-provider';
import {ContextUser} from '@daita/core/dist/auth';
import {PermissionBuilder, RelationalSchema} from '@daita/core';
import {RelationalMigrationAdapter} from '@daita/core/dist/adapter/relational-migration-adapter';
import {RelationalMigrationContext} from '@daita/core/dist/context/relational-migration-context';

export class RelationalUserProvider implements UserProvider {
  private context: RelationalMigrationContext;
  private migrated = false;

  constructor(private dataAdapter: RelationalMigrationAdapter) {
    this.context = schema.context(dataAdapter, {
      user: {
        username: 'provider',
        id: 'provider',
        claims: [],
        roles: ['provider'],
      },
    });
  }

  async addRole(name: string) {
    await this.context.insert(Role).value({
      name,
    });
  }

  async addUserRole(userId: string, roleName: string) {
    const index = userId.lastIndexOf(':');
    const issuer = userId.substr(0, index);
    const subject = userId.substr(index + 1);
    await this.context.insert(UserRole)
      .value({
        roleName: roleName,
        userIssuer: issuer,
        userSubject: subject,
      });
  }

  async get(token: AccessToken): Promise<ContextUser> {
    const roles: string[] = [];

    if (!this.migrated) {
      await this.context.applyMigrations();
      this.migrated = true;
    }

    let user = await this.context
      .select(User)
      .where({
        issuer: token.iss,
        subject: token.sub,
      })
      .first();

    if (!user) {
      user = new User();
      user.subject = token.sub;
      user.issuer = token.iss;
      user.email = (<any>token).email;
      user.firstName = (<any>token).given_name;
      user.lastName = (<any>token).family_name;
      await this.context.insert(User).value(user);
    } else {
      const userRoles = await this.context
        .select(UserRole)
        .where({
          user: {
            issuer: token.iss,
            subject: token.sub,
          },
        });
      roles.push(...userRoles.map(ur => ur.roleName));
    }

    return {
      roles: roles,
      claims: [],
      id: `${user.issuer}:${user.subject}`,
      username: null,
    };
  }
}

class User {
  subject!: string;
  issuer!: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}

class UserRole {
  user!: User;
  userSubject!: string;
  userIssuer!: string;
  role!: Role;
  roleName!: string;
}

class Role {
  name!: string;
}

const schema = new RelationalSchema({schema: 'auth'});
schema.table(User, {key: ['subject', 'issuer']});
schema.table(Role, {key: ['name']});
schema.table(UserRole, {key: ['userSubject', 'userIssuer', 'roleName']});

const permissions = new PermissionBuilder();
permissions.push(User, {role: 'provider', select: true, type: 'role'});
permissions.push(Role, {role: 'provider', select: true, type: 'role'});
permissions.push(UserRole, {role: 'provider', select: true, type: 'role'});

schema.migration({
  id: 'first-auth',
  steps: [
    {kind: 'add_table', table: 'User'},
    {kind: 'add_table', table: 'Role'},
    {kind: 'add_table', table: 'UserRole'},
    {kind: 'add_table_field', table: 'User', type: 'string', fieldName: 'subject', required: true},
    {kind: 'add_table_field', table: 'User', type: 'string', fieldName: 'issuer', required: true},
    {kind: 'add_table_field', table: 'User', type: 'string', fieldName: 'email', required: false},
    {kind: 'add_table_field', table: 'User', type: 'string', fieldName: 'firstName', required: false},
    {kind: 'add_table_field', table: 'User', type: 'string', fieldName: 'lastName', required: false},
    {kind: 'add_table_field', table: 'Role', type: 'string', fieldName: 'name', required: true},
    {kind: 'add_table_field', table: 'UserRole', type: 'string', fieldName: 'userSubject', required: true},
    {kind: 'add_table_field', table: 'UserRole', type: 'string', fieldName: 'userIssuer', required: true},
    {kind: 'add_table_field', table: 'UserRole', type: 'string', fieldName: 'roleName', required: true},
    {kind: 'add_table_primary_key', table: 'User', fieldNames: ['subject', 'issuer']},
    {kind: 'add_table_primary_key', table: 'Role', fieldNames: ['name']},
    {kind: 'add_table_field', table: 'Role', type: 'string', fieldName: 'name', required: false},
    {kind: 'add_table_primary_key', table: 'UserRole', fieldNames: ['userSubject', 'userIssuer', 'roleName']},
    {
      kind: 'add_table_foreign_key',
      table: 'UserRole',
      fieldNames: ['userSubject', 'userIssuer'],
      required: true,
      name: 'user',
      foreignTable: 'User',
      foreignFieldNames: ['subject', 'issuer'],
    },
    {
      kind: 'add_table_foreign_key',
      table: 'UserRole',
      fieldNames: ['roleName'],
      required: true,
      name: 'role',
      foreignTable: 'Role',
      foreignFieldNames: ['name'],
    },
    {kind: 'add_table_permission', table: 'User', permission: {role: 'provider', select: true, type: 'role'}},
    {kind: 'add_table_permission', table: 'Role', permission: {role: 'provider', select: true, type: 'role'}},
    {kind: 'add_table_permission', table: 'UserRole', permission: {role: 'provider', select: true, type: 'role'}},
  ],
});

schema.permission(permissions);