import {User} from './models/user';
import {SchemaRules} from './utils';

const rules = new SchemaRules();

rules.table(User)
  .rule({
    conditions: {
      email: {$regex: /[a-zA-Z0-9-_]+\@[a-zA-Z0-9-_]+.[a-zA-Z0-9]+/},
    },
  });