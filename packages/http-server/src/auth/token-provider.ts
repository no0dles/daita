import { SqlPermissions } from "@daita/relational";

export interface TokenProvider {
  verify(token: string): Promise<TokenVerifyResult>;
}

export interface TokenVerifyResult {
  permissions?: SqlPermissions | null;
  expireIn?: number;
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
