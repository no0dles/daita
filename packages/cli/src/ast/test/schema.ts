import { RelationalSchema } from '@daita/orm';
import { allow, authorized, Rule, all, table } from '@daita/relational';

class User {
  username!: string;
}

export const userRules: Rule[] = [
  allow(authorized(), { select: all(User), from: table(User) }),
];

export const schema = new RelationalSchema();
schema.table(User, { key: ['username'], rules: userRules });
