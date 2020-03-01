export interface TokenProvider {
  verify(token: string): Promise<AccessToken>;
}

export interface AccessToken {
  iss: string;
  sub: string;
  exp?: number;
  nbf?: number;
  iat?: number;
}
//
// export class User {
//   id!: string;
//   sub!: string;
//   aud!: string;
//   username?: string;
//   email?: string;
// }
//
// export class Role {
//   id!: string;
//   name!: string;
// }
//
// export class UserRole {
//   user!: User;
//   role!: Role;
// }