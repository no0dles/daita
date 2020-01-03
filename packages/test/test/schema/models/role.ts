import {User} from './user';

export class Role {
  name!: string;
}

export class UserRole {
  role!: Role;
  user!: User;
}

// type Constructable<T = any> = { new (...args: any[]): T };
//
// interface Query<T> {
//   where<V>(selector: (value: T) => V, value: V): Query<T>;
//   include<V extends Mode>(selector: (value: T) => V): Query<T>;
// }
//
// function query<T>(type: Constructable<T>): Query<T> {
//   return null;
// }
//
// query(UserRole)
//   .where(ur => ur.role.name, '1')
//   .include(ur => ur.role)
//   .include(ur => ur.role.name);
